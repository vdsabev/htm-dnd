import { html } from '../../lib/preact.js';

export default ({ type, direction, move, children, ...props }) => html`
  <div
    ...${props}
    class="${props.class || ''} ${direction || 'horizontal'}"
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
    <style>
      :scope.horizontal {
        padding: 0.25rem 0;
      }

      :scope.horizontal:last-of-type {
        height: 100%;
      }

      :scope.vertical {
        padding: 0 0.25rem;
      }

      :scope.horizontal::after {
        width: 100%;
        height: 0.5rem;
      }

      :scope.vertical::after {
        width: 0.5rem;
        height: 100%;
      }

      :scope::after {
        content: '';
        display: block;
        border-radius: 2px;
        background-color: transparent;
        transition: background-color 50ms linear;
      }

      :scope[data-dragenter]::after {
        background-color: var(--primary);
      }
    </style>

    ${children}
  </div>
`;
