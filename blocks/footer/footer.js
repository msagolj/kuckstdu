import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';
import { next,prev } from '../header/header.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {

  block.textContent = '';

  // get footer text for center section
  const resp = await fetch(`./footer.plain.html`);
  const html = await resp.text();

  // get header content from common header document
  if (!document.headerContent) {
    document.headerContent = fetch(`./header.plain.html`).then(response => response.text());
  }

  // get the list of links
  const slides = document.createRange().createContextualFragment(await document.headerContent)
    .querySelector('ul').querySelectorAll(`a`);

  // find previous and next link if valid
  for(var i = 0 ; i < slides.length; ++i){
    let e = slides[i];
    if (e.getAttribute('href') === document.location.pathname) {
      // get next link if there is one
      if( i+1 < slides.length){
      next.href = slides[i+1].getAttribute('href');
      next.title = slides[i+1].innerText;
      }
      break;
    } else {
      // store as most recent previous link
      prev.href = e.getAttribute('href');
      prev.title = e.innerHTML;
    }
  }

  // build footer dom
  const dom = document.createRange().createContextualFragment(`
    <div class='footernav'>
      <div class='prev'>
        <a href='${prev.href}'><span class='${prev.title?'icon icon-previousarrow':''}'></span>${prev.title?prev.title:""}</a>
      </div>
      <div class='footertext'>${html}</div>
      <div class='next'>
        <a href='${next.href}'></span>${next.title?next.title:''}<span class='${next.title?'icon icon-nextarrow':''}'></a>
      </div>
    </div>
  `);
  // add dom
  block.append(dom);
  // generate icons
  decorateIcons(block);
}
