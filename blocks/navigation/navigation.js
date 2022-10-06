import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {

  const links = block.querySelectorAll('a');

  block.textContent = '';
  
  const dom = document.createRange().createContextualFragment(`
    <div class='navlinks'>
      <div class='previous'>
      <span class='icon icon-previousarrow'></span>
      </div>
      <div class='next'>
      <span class='icon icon-nextarrow'></span>
      </div>
    </div>
  `)

  if (links[0]) {
    dom.querySelector('.previous').append(links[0]);
  }
    
  if (links[1]) {
    dom.querySelector('.next').prepend(links[1]);
  }

  block.append(dom);
  decorateIcons(block);
  console.log(block)
}