import { getMetadata } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.textContent = '';
  const description = getMetadata('description');
  if (description !== '' && description !== null) {
    block.append(document.createRange().createContextualFragment(`
    <div class='tldr-icon'>&lt;tldr&gt;</div><div class='tldr-info'>${description}</div>`));
  }
}
