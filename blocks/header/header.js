import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  
  block.textContent = '';

  // get header content from extra page
  // actually its only the logo , nav is dynamic
  const resp = await fetch(`/header.plain.html`);
  const html = await resp.text();
  // get the picture element
  const picture = document.createRange()
    .createContextualFragment(html).querySelector('picture');
 
  const dom = document.createRange().createContextualFragment(`
    <div class='logo'>
    </div>
    <div class='nav'>
      <nav>
        <ul>
        </ul>
      </nav>
    </div>
  `)

  dom.querySelector('.logo').append(picture);
  const ul = dom.querySelector('ul');

  document.querySelectorAll('h1').forEach((elem, i) => {
    const title = elem.innerHTML;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href',"#" + title.toLowerCase());
    a.innerHTML = title;
    li.append(a);
    ul.append(li);
  })

  block.append(dom);
}
