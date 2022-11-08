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
  // get header content from common header document
  if (!document.headerContent) {
    document.headerContent = await (await fetch(`./header.plain.html`)).text();
    console.log('Footer:initialized headerContent');
  } else {
    console.log('Footer:found headerContent')
  }

  const slides = document.createRange().createContextualFragment(document.headerContent).querySelector('ul').querySelectorAll(`a`);
  await (() => {
    for(var i = 0 ; i < slides.length; ++i){
      let e = slides[i];
      if (e.getAttribute('href') === document.location.pathname) {
        if( i+1 < slides.length){
        console.log(i)
        next.href = slides[i+1].getAttribute('href');
        next.title = slides[i+1].innerText;
        }
        break;
      } else {
        prev.href = e.getAttribute('href');
        prev.title = e.innerHTML;
      }
    }
  })();
  
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
