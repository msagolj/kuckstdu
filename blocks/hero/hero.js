import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';


export default function decorate(block) {
    // get list of all images
    const heroImages = block.querySelectorAll('picture')
    // clear the block  
    block.textContent ='';

    heroImages.forEach(elem => {
      let div = document.createElement('div');
      div.append(elem);
      block.append(div);
    });
}
