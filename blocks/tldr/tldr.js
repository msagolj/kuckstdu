import { getMetadata } from '../../scripts/scripts.js';

export default function decorate(Block) {
  Block.textContent = getMetadata('description');
}
