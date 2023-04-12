/* eslint-disable no-unused-expressions */

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

function getLink(entry, isCurrentPage) {
  const link = document.createElement('a');
  link.innerText = entry.title ? entry.title : '[no title]';
  link.setAttribute('href', entry.path);
  if (isCurrentPage) link.classList.add('active');
  return link;
}

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

function buildSiteTree(entries, currentPage, openLevels) {
  // get sub paths for current page
  const currPageSubPaths = getSubPaths(currentPage);
  // skip special case / to the end
  const root = entries[0].path === '/' ? entries.shift() : null;
  // init the build array with a root ul element
  const buildSubPaths = [['', document.createElement('ul')]];
  // go through all the entries in the navigation
  [...entries].forEach((entry) => {
    // go through all sub paths
    const currEntrySubPaths = getSubPaths(entry.path);
    for (let i = 0; i < currEntrySubPaths.length; i += 1) {
      // if we are deeper then the previous entry or diverging from pervious path
      if (!buildSubPaths[i] || buildSubPaths[i][0] !== currEntrySubPaths[i]) {
        // check if we are on the current page's path
        const isCurrPageSubPath = (currPageSubPaths[i] === currEntrySubPaths[i]);
        // create a new list element
        const li = document.createElement('li');
        // add it to the parent ul
        buildSubPaths[i - 1][1].append(li);
        // if its a leaf page add link
        if (i === currEntrySubPaths.length - 1) {
          li.append(getLink(entry, isCurrPageSubPath));
        } else {
          // its a folder
          const folder = addFolder(li, (i <= openLevels || isCurrPageSubPath));
          // add new folder to build path
          buildSubPaths[i] = [currEntrySubPaths[i], folder];
          // if its a folder with an index page add a link and go to next entry
          if (currEntrySubPaths[i + 1].endsWith('/')) {
            li.prepend(getLink(entry, isCurrPageSubPath));
            break;
          } else { // folder with no content, use folder name
            const span = document.createElement('span');
            span.innerText = currEntrySubPaths[i].split('/').pop();
            if (isCurrPageSubPath) span.classList.add('active');
            li.prepend(span);
          }
        }
      }
    }
  });

  // if / was the very first entry
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
  // return the root ul element
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
    data.shift();
    nav.append(buildSiteTree(data, window.location.pathname, 0));
    block.append(nav);
  }
}
