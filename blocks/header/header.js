import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * @param {Element} block The header block element
 */
export default async function decorate(block) {

  // get header content from common header document
  const domHeader = document.createRange().createContextualFragment((await (await fetch(`/header.plain.html`)).text()));
  // get the logo
  const domLogo = domHeader.querySelector('picture');
  // get the main title
  const domTitle = domHeader.querySelector('h1')
  // get the list of pages
  const domSlides = domHeader.querySelector('ul');

  // create Hamburger nav dom
  const domHamburger = document.createRange().createContextualFragment(`
    <input type='checkbox' id='hamburger-toggle'/>
    <label class='hamburger-button-label' for='hamburger-toggle'>
      <span></span>  
      <span></span>  
      <span></span>  
    </label>
    <div class='hamburger-nav'>
    </div>   
  `)

  // add the nav entries to dom
  const navlist = domHamburger.querySelector('.hamburger-nav');
  // add class to active entry
  domSlides.querySelector(`a[href='${document.location.pathname}']`).classList = 'active';
  navlist.append(domSlides);


  // add the hamburger menu
  block.append(domHamburger);
  // add the logo
  block.append(domLogo);
  // add the title
  block.append(domTitle);
}
