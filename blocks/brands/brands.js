export default function decorate(block) {
  const flex = block.children[0].children[0];
  block.textContent = '';
  block.append(flex)


}