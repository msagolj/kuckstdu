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

function buildSiteTree(sortedNavEntries, currentPage, openLevels) {
  // turn active page into ordered list of all sub paths it contains
  const currPageSubPaths = getSubPaths(currentPage);

  // init the previous entry array
  const rootUl = document.createElement('ul');
  rootUl.classList.add('root');
  let buildSubPaths = [['', rootUl]];

  // go through all the entries in the navigation
  [...sortedNavEntries].forEach((entry) => {
    // get ordered sub paths
    const currEntrySubPaths = getSubPaths(entry.path);
    // go through all sub paths
    for (let i = 0; i < currEntrySubPaths.length; i += 1) {
      // if we are deeper then the previous entry or diverging from pervious path
      if (!buildSubPaths[i] || buildSubPaths[i][0] !== currEntrySubPaths[i]) {
        // marker if we are on active path
        const isActivePath = currEntrySubPaths[i] === currPageSubPaths[i];
        // star the element
        const li = document.createElement('li');
        // is it a leaf page
        if (i === currEntrySubPaths.length - 1) {
          // add link to page
          const link = document.createElement('a');
          link.innerText = entry.title ? entry.title : '[no title]';
          link.setAttribute('href', entry.path);
          // hightlight active path
          if (isActivePath) link.classList.add('active');
          li.append(link);
          // add it to parent ul
          buildSubPaths[i - 1][1].append(li);
          // cut of the rest afterwards if there is any
          buildSubPaths = buildSubPaths.slice(0, i + 1);
        } else { // its a folder
          // add event listener
          li.addEventListener('click', (e) => {
            // eslint-disable-next-line no-unused-expressions
            e.target.classList.contains('open') ? e.target.classList.replace('open', 'closed') : e.target.classList.replace('closed', 'open');
            e.stopPropagation();
          });
          // open or closed
          // eslint-disable-next-line no-unused-expressions
          (i <= openLevels || (isActivePath && currentPage !== currEntrySubPaths[i + 1])) ? li.classList.add('open') : li.classList.add('closed');
          // add it to the parent ul
          buildSubPaths[i - 1][1].append(li);
          // start a new sub ul
          const folderContent = document.createElement('ul');
          li.append(folderContent);
          // update buildSubPaths
          buildSubPaths[i] = [currEntrySubPaths[i], folderContent];
          // cut of the rest afterwards if there is any
          buildSubPaths = buildSubPaths.slice(0, i + 1);
          // if its a folder with an index page
          if (currEntrySubPaths[i + 1].endsWith('/')) {
            // then we add a link
            const link = document.createElement('a');
            link.innerText = entry.title ? entry.title : '[no title]';
            link.setAttribute('href', entry.path);
            // hightlight active path
            if (isActivePath) link.classList.add('active');
            li.prepend(link);
            break;
          } else {
            const span = document.createElement('span');
            span.innerText = currEntrySubPaths[i].split('/').pop();
            // hightlight active path
            if (isActivePath) span.classList.add('active');
            li.prepend(span);
          }
        }
      }
    }
  });

  // return the root ul element
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
    nav.append(buildSiteTree(data, window.location.pathname, 6));
    block.append(nav);
  }
}
