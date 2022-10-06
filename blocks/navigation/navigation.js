import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';
export default function decorate(block) {
  const links = block.querySelectorAll('a');

  block.textContent = '';
  const dom = document.createRange().createContextualFragment(`
    <div class='navlinks'>
      <div class='previous'>
      :nextarrow:
      </div>
      <div class='next'>
      :previousarrow:
      </div>
    </div>
  `)

  if (links[0]) {
    dom.querySelector('.previous').append(links[0]);
  }
    
  if (links[1]) {
    dom.querySelector('.next').append(links[1]);
  }

  block.append(dom);
  decorateIcons(block);
  console.log(block)
}