import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

export default function decorate(block) {

  block.children[0].classList = 'navlinks';
  block.children[0].children[0].classList = 'previous';
  block.children[0].children[1].classList = 'next';
  
  const leftarrow = document.createElement('span');
  leftarrow.classList = 'icon icon-previousarrow';

  const rightarrow = document.createElement('span');
  rightarrow.classList = 'icon icon-nextarrow';

  const links = block.querySelectorAll('a');
  links[0].prepend(leftarrow);
  links[1].append(rightarrow);

  decorateIcons(block);
  console.log(block)
}