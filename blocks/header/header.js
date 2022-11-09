/**
 * @param {Element} block The header block element
 */
export default async function decorate(block) {

  // get header content from common header document, if not already loaded by footer block
  if (!document.headerContent) {
    // make it a promise
    document.headerContent =fetch(`./header.plain.html`).then(response => response.text());
  }

  // get the dom, wait for promise 
  const domHeader = document.createRange().createContextualFragment(await document.headerContent);
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

  // fill in list of slides
  domHamburger.querySelector('.hamburger-nav').append(domSlides);
  // mark active page
  domHamburger.querySelector(`[href='${document.location.pathname}']`).classList = 'active';
  // add the hamburger menu
  block.append(domHamburger);
  // add the logo
  block.append(domLogo);
  // add the title
  block.append(domTitle);
}
