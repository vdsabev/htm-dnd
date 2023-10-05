import { html } from '../../lib/preact.js';

import Dropzone from './Dropzone.js';
import Task from './Task.js';

export default ({ lane, actions, ...props }) => html`
  <div
    ...${props}
    class="${props.class ||
    ''} relative flex flex-col min-w-[var(--lane-width)] border rounded w-[var(--lane-width)] bg-slate-100 px-3 shadow-inner overflow-y-auto cursor-grab active:cursor-grabbing"
    draggable="true"
    ondragstart=${(event) => {
      window.app.itemBeingDragged = { type: 'lane', item: lane };
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
    <${Dropzone}
      type="task"
      direction="horizontal"
      move=${(task) => actions.moveTask(task, 0, lane)}
    >
      <div class="pt-2">
        <span
          class="outline-offset-4 font-bold"
          contenteditable
          onblur=${(event) =>
            actions.updateLane(lane, event.currentTarget.textContent)}
        >
          ${lane.name}
        </span>

        <span
          class="inline-block ml-1 px-2 rounded-full bg-slate-200 font-bold"
        >
          ${lane.tasks.length}
        </span>

        <button
          type="button"
          class="absolute px-3 py-1 border-transparent top-0 right-0 hover:bg-white hover:border-slate-500"
          title="Remove lane"
          onclick=${() => actions.removeLane(lane)}
        >
          ×
        </button>
      </div>

      <${Task}
        class="mt-3 mb-1 after:text-slate-400 empty:after:content-[attr(data-title)]"
        task=${{ text: '' }}
        contenteditable
        onblur=${(event) => {
          actions.addTask(lane, event.currentTarget.textContent);
          event.currentTarget.textContent = '';
        }}
        onkeypress=${(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            actions.addTask(lane, event.currentTarget.textContent);
            event.currentTarget.textContent = '';
            event.preventDefault();
          }
        }}
        data-title="What needs doing?"
      />
    <//>

    ${lane.tasks.map(
      (task, index) => html`
        <${Task}
          task=${task}
          contenteditable
          onblur=${(event) =>
            actions.updateTask(task, event.currentTarget.textContent)}
        />
        <${Dropzone}
          type="task"
          direction="horizontal"
          move=${(task) => actions.moveTask(task, index + 1, lane)}
        />
      `
    )}
  </div>
`;
