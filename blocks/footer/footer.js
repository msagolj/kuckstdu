import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {

  block.textContent = '';

  const resp = await fetch(`/footer.plain.html`);
  const html = await resp.text();
  block.innerHTML = html;
}
