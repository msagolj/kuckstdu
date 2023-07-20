/**
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
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
    <h1>Kuckst du</h1>
  `);

  // add the hamburger menu
  block.append(domHamburger);
}
