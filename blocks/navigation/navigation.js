import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';
export default function decorate(block) {
  const links = block.querySelectorAll('a');
  links[0].prepend(" :nextarrow: ");
  decorateIcons(block);
  console.log(block)
}