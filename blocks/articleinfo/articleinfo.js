import { getMetadata } from '../../scripts/scripts.js';

export default function decorateBlock(block) {
  block.textContent = '';
  const articleInfo = document.createRange().createContextualFragment(`
    <div class="article-date">
      <div class="published">Published: ${getMetadata('publication-date') === null ? '---' : getMetadata('publication-date')}</div>
      <div class="last-modified">Last Update: ${document.lastModified}</div>
    </div>
    <div class="author">${getMetadata('author') === null ? '' : `Author: ${getMetadata('author')}`}</div>
  `);
  block.append(articleInfo);
}
