import { html } from '../../lib/preact.js';

export default ({ task, ...props }) => html`
  <div
    ...${props}
    class="${props.class ||
    ''} px-3 py-2 whitespace-pre-line bg-white border rounded-sm shadow-sm select-none cursor-grab active:cursor-grabbing active:caret-transparent empty:cursor-text"
    draggable=${!!task.text}
    ondragstart=${(event) => {
      window.app.itemBeingDragged = { type: 'task', item: task };
      event.stopPropagation(); // Prevent parent node from receiving child events
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', event.currentTarget.textContent); // Used when dragging into other apps
    }}
    ondragover=${(event) => {
      event.preventDefault(); // Prevent cursor from turning into not-allowed
    }}
    ondragend=${() => {
      window.app.itemBeingDragged = null;
    }}
  >
    ${task.text}
  </div>
`;
