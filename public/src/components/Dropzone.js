import { html } from '../../lib/preact.js';

const classesByDirection = {
  horizontal:
    'py-1 after:h-2 [&[data-dragenter]]:after:bg-gradient-to-r last:h-full',
  vertical:
    'px-1 after:w-2 after:h-full [&[data-dragenter]]:after:bg-gradient-to-b',
};

export default ({ direction, move, children }) => html`
  <div
    class="${classesByDirection[direction] ||
    classesByDirection.horizontal} after:block after:h-2 after:rounded-sm after:from-sky-700 after:via-sky-400 after:to-sky-700"
    ondragover=${(event) => {
      // Set dragover to trigger dropzone when hovering over child elements
      event.preventDefault();
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragenter=${(event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragleave=${(event) => {
      event.stopPropagation();
      event.currentTarget.removeAttribute('data-dragenter');
    }}
    ondrop=${(event) => {
      event.currentTarget.removeAttribute('data-dragenter');
      const itemId = event.dataTransfer.getData('text/plain');
      move(itemId);
      // document.activeElement.blur();
      // or
      // event.currentTarget.blur();
    }}
  >
    ${children}
  </div>
`;
