import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  
  block.textContent = '';

  // get header content from extra page
  const resp = await fetch(`/header.plain.html`);
  const html = await resp.text();
  
  block.innerHTML = html;
}
