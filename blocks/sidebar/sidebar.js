/* eslint-disable no-unused-expressions */

function createLIEntry(page, isPage, pathElem, activePage) {
  // create an li element
  const li = document.createElement('li');
  // if we have reached page level
  if (isPage) {
    const title = page.title !== '' ? page.title : '[NO TITLE]';
    // if its the currently active page
    if (page.path === activePage) {
      // highlight it
      const span = document.createElement('span');
      span.innerText = title;
      span.classList.add('active');
      li.append(span);
    } else {
      // create a link to the page
      const a = document.createElement('a');
      a.setAttribute('href', page.path);
      a.innerText = title;
      li.append(a);
    }
  } else {
    // if not its an folder
    li.innerText = `${pathElem}`;
  }
  return li;
}

/**
 * Renders nested UL's for a page hierarchy.
 * Handles root ('/'), index pages, folders, pages with no titles, max open levels,
 * current Page highlighting.
 * @param {Array<Array>} pages Array of pages, sorted alphabetically by path.
 * Each entry is [path,title];
 * @param {int} openLevels How many levels of the hierarchy should be shown open initially.
 * @param {string} activePage The page that should be highlighted as the current page we are on.
 * @returns the root UL element that can be attached to the DOM.
 */
function buildSiteTree(pages, openLevels, activePage) {
  // start with an empty root list
  let buildPath = [[undefined, document.createElement('ul')]];
  // loop while there are pages
  while (pages.length > 0) {
    // get the next page
    const page = pages.shift();
    // ignore the / at the begining
    const pagePath = page.path.substring(1).split('/');
    // ignore trailing / (aka index page) exept for special case root path '/'
    if (pagePath.length > 1 && pagePath.slice(-1)[0] === '') pagePath.pop();

    // loop through all the path parts
    // eslint-disable-next-line no-loop-func
    [...pagePath].forEach((pathElem, i) => {
      // if we are deeper then prev entry
      if (buildPath[i] === undefined) {
        // start a new sublist
        const ul = document.createElement('ul');
        const li = createLIEntry(page, pagePath.length === i + 1, pathElem, activePage);
        ul.append(li);
        const parentLi = buildPath[i - 1][1].lastChild;
        // append it to parents last li element
        parentLi.append(ul);
        // show the entry as open if below open levels or if its current page path
        if (i < openLevels || activePage.startsWith(`/${buildPath.map((e) => e[0]).join('/')}`)) {
          parentLi.classList.add('open');
        } else {
          parentLi.classList.add('closed');
        }
        // add event listener to open close folders
        parentLi.addEventListener('click', (e) => {
          const { classList } = e.target;
          classList.contains('open') ? classList.replace('open', 'closed') : classList.replace('closed', 'open');
          e.stopPropagation();
        });
        // make the new ul the current element
        buildPath[i] = [pathElem, ul];
        return;
      }
      // if we are diverging
      if (buildPath[i][0] !== pathElem) {
        // create a new li entry
        const li = createLIEntry(page, pagePath.length === i + 1, pathElem, activePage);
        // update the current entry's name
        buildPath[i][0] = pathElem;
        // add the new li entry to the list
        buildPath[i][1].append(li);
        // cut of the rest
        buildPath = buildPath.slice(0, i + 1);
      }
    });
  }
  // return the root list
  return buildPath[0][1];
}

export default async function decorate(block) {
  block.textContent = '';
  const resp = await fetch('/query-index.json');
  if (resp.ok) {
    // generate outer structure
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Site Navigation');
    const siteNavTitle = document.createElement('h1');
    siteNavTitle.innerHTML = 'Site Navigation';
    nav.append(siteNavTitle);
    // get the sorted list of links
    const { data } = await resp.json();
    nav.append(buildSiteTree(data, 1, window.location.pathname));
    block.append(nav);
  }
}
