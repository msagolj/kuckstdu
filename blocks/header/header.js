export let prev = {};
export let next = {};

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

  // fill in list of slides
  domHamburger.querySelector('.hamburger-nav').append(domSlides);
  // add the hamburger menu
  block.append(domHamburger);
  // add the logo
  block.append(domLogo);
  // add the title
  block.append(domTitle);

  const slides = domSlides.querySelectorAll(`a`);
  await (() => {
    for(var i = 0 ; i < slides.length; ++i){
      let e = slides[i];
      if (e.getAttribute('href') === document.location.pathname) {
        e.classList = 'active';  
        next.href = slides[i+1].getAttribute('href');
        next.title = slides[i+1].innerText;
        break;
      } else {
        prev.href = e.getAttribute('href');
        prev.title = e.innerHTML;
      }
    }
  })();
  console.log(prev.title);
  console.log(next);
}
