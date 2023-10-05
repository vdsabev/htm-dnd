import { html } from '../../lib/preact.js';

export default ({ task, class: className, textClass, ...props }) => html`
  <div
    class=${className || ''}
    draggable=${!!task.text}
    ondragstart=${(event) => {
      window.app.itemBeingDragged = { type: 'task', item: task };
      event.stopPropagation(); // Prevent parent node from receiving child events
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', event.currentTarget.innerText); // Used when dragging into other apps
    }}
    ondragover=${(event) => {
      event.preventDefault(); // Prevent cursor from turning into not-allowed
    }}
    ondragend=${() => {
      window.app.itemBeingDragged = null;
    }}
  >
    <style>
      :scope {
        cursor: grab;
        user-select: none;
        box-shadow: var(--shadow-sm);
        border-radius: 2px;
        border-width: 1px;
        background-color: var(--neutral-0);
      }

      :scope:active {
        cursor: grabbing;
        caret-color: transparent;
      }

      :scope div {
        padding: 0.5rem 0.75rem;
        white-space: pre-line;
      }
    </style>

    <div key=${task.text} ...${props} class=${textClass || ''}>
      ${task.text}
    </div>
  </div>
`;
