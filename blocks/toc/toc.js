import { decorateIcons } from '../../scripts/scripts.js';

/**
 * Generates an LI element with an anchor link to the the heading.
 *
 * @param {HTMLElement} heading a Hx HTML element.
 * @returns {HTMLElement} an LI element .
 */
function consumeEntry(heading) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.addEventListener('click', (e) => {
    const top = heading.getBoundingClientRect().y + window.scrollY
    - document.querySelector('header').clientHeight;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  });
  li.append(a);
  a.innerHTML = heading.innerHTML;
  return li;
}

/**
 * Recursive function that converts hierarchical Hx headings into nested UL lists.
 *
 * @param {Array<HTMLElement>} headings List of Heading elements from main text.
 * @param {Number} currentHeadingLevel The current heading level.
 * @param {HTMLElement} parentList The UL element of the current level.
 */
function buildTOC2(headings, currentHeadingLevel, parentList) {
  // loop while there are headings
  while (headings.length > 0) {
    // get level of next heading
    const nextHeadingLevel = parseInt(headings[0].tagName.slice(1), 10);

    // while on same level
    if (nextHeadingLevel === currentHeadingLevel) {
      parentList.append(consumeEntry(headings.shift()));
      // eslint-disable-next-line no-continue
      continue;
    }

    // if its one level deeper
    if (currentHeadingLevel < nextHeadingLevel) {
      // you cant skip headings on the way down
      if (nextHeadingLevel - currentHeadingLevel > 1) {
        // eslint-disable-next-line no-console
        console.error(`"${headings[0].innerText}" -> You skipped heading level(s), resulting in incorrect TOC!`);
      }
      // start a sublist
      const subList = document.createElement('ul');
      parentList.lastChild.append(subList);
      parentList.lastChild.classList.add('open');
      parentList.lastChild.addEventListener('click', (e) => {
        // eslint-disable-next-line no-unused-expressions
        e.target.classList.contains('open') ? e.target.classList.replace('open', 'closed') : e.target.classList.replace('closed', 'open');
        e.stopPropagation();
      });
      buildTOC2(headings, nextHeadingLevel, subList);
      // eslint-disable-next-line no-continue
      continue;
    }

    // if its any level(s) higher, let parent list deal with it
    if (currentHeadingLevel > nextHeadingLevel) {
      return;
    }
  }
}

/**
 * Generates a TOC, based on the headings in the main section titlesand 
 * turn them into nested UL lists.
 *
 * @param {HTMLElement} block The root element of the block.
 */
export default async function decorate(block) {
  block.textContent = '';
  const tocTitle = document.createElement('h1');
  tocTitle.innerHTML = 'Article Content';
  block.append(tocTitle);

  const headings = Array.from(document.querySelectorAll('main > div.section h1,h2,h3,h4,h5,h6'));
  const ul = document.createElement('ul');
  buildTOC2(headings, 1, ul);
  decorateIcons(block);
  block.append(ul);
}
