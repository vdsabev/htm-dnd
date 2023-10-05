import { html } from '../../lib/preact.js';

const classesByDirection = {
  horizontal:
    'py-1 after:h-2 [&[data-dragenter]]:after:bg-gradient-to-r last:h-full',
  vertical:
    'px-1 after:w-2 after:h-full [&[data-dragenter]]:after:bg-gradient-to-b',
};

export default ({ type, direction, move, children, ...props }) => html`
  <div
    ...${props}
    class="${props.class || ''} ${classesByDirection[direction] ||
    classesByDirection.horizontal} after:block after:h-2 after:rounded-sm after:from-sky-700 after:via-sky-400 after:to-sky-700"
    ondragover=${(event) => {
      event.preventDefault();

      if (window.app.itemBeingDragged?.type !== type) return;
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragenter=${(event) => {
      if (window.app.itemBeingDragged?.type !== type) return;

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragleave=${(event) => {
      if (window.app.itemBeingDragged?.type !== type) return;

      event.stopPropagation();
      event.currentTarget.removeAttribute('data-dragenter');
    }}
    ondrop=${(event) => {
      const { itemBeingDragged } = window.app;
      if (itemBeingDragged?.type === type && itemBeingDragged?.item) {
        move(itemBeingDragged.item);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
      event.currentTarget.removeAttribute('data-dragenter');
    }}
  >
    ${children}
  </div>
`;
