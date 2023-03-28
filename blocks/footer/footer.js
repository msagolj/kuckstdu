import { decorateIcons, getMetadata } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.textContent = '';
  getMetadata('article:tag').split(',').forEach((tag) => {
    const button = document.createElement('button');
    button.textContent = tag.trim();
    button.classList.add('tag');
    block.append(button);
  });
  decorateIcons(block);
}
