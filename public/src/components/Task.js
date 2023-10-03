import { html } from 'html';

export default ({ task }) => html`
  <div
    class="px-3 py-2 whitespace-pre-line bg-white border rounded-sm shadow-sm select-none cursor-grab active:cursor-grabbing"
    draggable="true"
    ondragstart=${(event) => {
      event.stopPropagation(); // Prevent parent node from receiving child events
      event.dataTransfer.setData('text/plain', task._id);
      event.dataTransfer.effectAllowed = 'move';
    }}
  >
    ${task.text}
  </div>
`;
