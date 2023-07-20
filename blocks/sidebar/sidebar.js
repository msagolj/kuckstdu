/* eslint-disable no-continue */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */

/* generates a list of all sub paths of a url */
function getSubPaths(entry) {
  const subPaths = [];
  entry.split('/').reduce((prevSubPath, nextPathElem) => {
    const nextSubPath = `${prevSubPath}/${nextPathElem}`;
    subPaths.push(nextSubPath);
    return nextSubPath;
  });
  subPaths.unshift('');
  return subPaths;
}

/* generates the link element */
function getLink(entry, isCurrentPage) {
  const link = document.createElement('a');
  link.innerText = entry.title ? entry.title : '[no title]';
  link.setAttribute('href', entry.path);
  if (isCurrentPage) link.classList.add('active');
  return link;
}

/* creates the folder DOM and event listeners */
function addFolder(li, isOpen) {
  // add event listener to open/close
  li.addEventListener('click', (e) => {
    const classes = e.target.classList;
    classes.contains('open') ? classes.replace('open', 'closed') : classes.replace('closed', 'open');
    e.stopPropagation();
  });
  // open or closed
  isOpen ? li.classList.add('open') : li.classList.add('closed');
  // start a new sub ul
  const folderContent = document.createElement('ul');
  li.append(folderContent);
  return folderContent;
}

/**
 * Generates an site navigation of nested ULs based on a sorted list of path entries.
 * Handles:
 * - root page '/'
 * - normal pages
 * - folders
 * - folders with an index page
 * - folders with page of same name on same level
 * - folder open/close
 * - missing page title
 * - opens nav to current page
 * - highlights current page path
 * - option to open x hierarchy levels on initial rendering
 *
 * @param {Array<string>} entries sorted lists of all navigation entries
 * @param {string} currentPage path of the current page that should be highlighted
 * @param {number} openLevels how many levels of site hierarch should be rendered open initally.
 * @returns the root UL element
 */
function buildSiteTree(entries, currentPage, openLevels) {
  // get sub paths for current page
  const currPageSubPaths = getSubPaths(currentPage);
  // skip special case / to the end
  const root = entries[0].path === '/' ? entries.shift() : null;
  // init the build array with a root ul/folder element
  const buildSubPaths = [['', document.createElement('ul')]];
  // go through all the entries in the navigation
  [...entries].forEach((entry) => {
    // go through all sub paths
    const currEntrySubPaths = getSubPaths(entry.path);
    for (let i = 0; i < currEntrySubPaths.length; i += 1) {
      // if we are still on the same path as previous nav entry
      if (buildSubPaths[i] && buildSubPaths[i][0] === currEntrySubPaths[i]) continue;

      // check if we are on the current page's path
      const isCurrPageSubPath = (currPageSubPaths[i] === currEntrySubPaths[i]);

      // if its a leaf page, add link
      if (i === currEntrySubPaths.length - 1) {
        const li = document.createElement('li');
        li.append(getLink(entry, isCurrPageSubPath));
        // add it to the parent ul/folder
        buildSubPaths[i - 1][1].append(li);
        continue;
      }

      // if its a folder with an index page add a link and go to next nav entry
      if (currEntrySubPaths[i + 1].endsWith('/')) {
        const li = document.createElement('li');
        const folder = addFolder(li, (i <= openLevels || isCurrPageSubPath));
        // add new folder to build path
        buildSubPaths[i] = [currEntrySubPaths[i], folder];
        li.prepend(getLink(entry, isCurrPageSubPath));
        // add it to the parent ul/folder
        buildSubPaths[i - 1][1].append(li);
        break;
      }

      // if its a folder with a page with same name on same level
      const prevEntry = buildSubPaths[i - 1][1].lastChild;
      if (prevEntry?.firstChild?.getAttribute('href') === currEntrySubPaths[i]) {
        // turn previous leaf into folder
        const folder = addFolder(prevEntry, (i <= openLevels || isCurrPageSubPath));
        // add new folder to build path
        buildSubPaths[i] = [currEntrySubPaths[i], folder];
        continue;
      }

      // else its just a folder
      const li = document.createElement('li');
      const folder = addFolder(li, (i <= openLevels || isCurrPageSubPath));
      // add new folder to build path
      buildSubPaths[i] = [currEntrySubPaths[i], folder];
      // addd a span with folder name
      const span = document.createElement('span');
      span.innerText = currEntrySubPaths[i].split('/').pop();
      if (isCurrPageSubPath) span.classList.add('active');
      li.prepend(span);
      // add it to the parent ul/folder
      buildSubPaths[i - 1][1].append(li);
    }
  });

  // if / was the very first entry, wrap with an addtional ul and return it
  if (root) {
    const ul = document.createElement('ul');
    ul.classList.add('root');
    const li = document.createElement('li');
    ul.append(li);
    li.removeChild(addFolder(li, true));
    li.append(getLink(root, true));
    li.append(buildSubPaths[0][1]);
    return ul;
  }

  // lese return default root ul element
  buildSubPaths[0][1].classList.add('root');
  return buildSubPaths[0][1];
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
    // ignore /
    data.shift();
    nav.append(buildSiteTree(data, window.location.pathname, 0));
    block.append(nav);
  }
}
