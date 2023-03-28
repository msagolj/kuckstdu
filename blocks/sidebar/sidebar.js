import { decorateIcons } from '../../scripts/scripts.js';

export default async function decorate(block) {
  block.textContent = 'SIDEBAR';
  decorateIcons(block);
}
