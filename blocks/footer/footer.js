import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';
import { next,prev } from '../header/header.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {

  block.textContent = '';

  // get center text
  const resp = await fetch(`/footer.plain.html`);
  const html = await resp.text();

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
  
  block.append(dom);
  decorateIcons(block);
}
