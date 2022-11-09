import { decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {

  block.textContent = '';

  // get center text
  const resp = await fetch(`./footer.plain.html`);
  const html = await resp.text();

  // get header content from common header document, if not already loaded by header block
  if (!document.headerContent) {
    // make it a promise
    document.headerContent =fetch('./header.plain.html').then(response => response.text());
  }

  // get the dom, wait for promise 
  const slides = document.createRange().createContextualFragment(await document.headerContent)
    .querySelector('ul').querySelectorAll(`a`);
  
  // info about previous/next link
  let prev = {};
  let next = {};

  // go through list of slides
  for(var i = 0 ; i < slides.length; ++i){
    let e = slides[i];
    // if its this is the slide currently shown
    if (e.getAttribute('href') === document.location.pathname) {
      // .. if there is a follow up page
      if( i+1 < slides.length){
        // store info about next link
        next['href'] = slides[i+1].getAttribute('href');
        next.title = slides[i+1].innerText;
      }
      break;
    } else {
      // this becomes the must current prev page
      prev.href = e.getAttribute('href');
      prev.title = e.innerHTML;
    }
  }

  // build the dom for the footer section
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
  // convert arrow icons to svg
  decorateIcons(block);
}
