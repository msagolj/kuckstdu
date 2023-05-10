import { getMetadata } from '../../scripts/scripts.js';

export default function decorate(Block) {
  const description = getMetadata('description');
  if (description !== '' && description !== null) {
    Block.textContent = description;
  } else {
    Block.textContent = '';
  }
}
