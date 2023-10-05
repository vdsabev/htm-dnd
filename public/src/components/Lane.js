import { html } from '../../lib/preact.js';

import Dropzone from './Dropzone.js';
import Task from './Task.js';

export default ({ lane, actions, ...props }) => html`
  <div
    ...${props}
    draggable="true"
    ondragstart=${(event) => {
      window.app.itemBeingDragged = { type: 'lane', item: lane };
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
        overflow-y: auto;
        position: relative;
        display: flex;
        flex-direction: column;

        box-shadow: var(--shadow) inset;
        min-width: var(--lane-width);
        width: var(--lane-width);

        border-radius: 4px;
        border-width: 1px;

        background-color: var(--neutral-100);
        padding: 0 0.75rem;
      }

      :scope:active {
        cursor: grabbing;
      }
    </style>

    <${Dropzone}
      type="task"
      direction="horizontal"
      move=${(task) => actions.moveTask(task, 0, lane)}
    >
      <div>
        <style>
          :scope {
            padding-top: 0.5rem;
          }

          :scope .title {
            outline-offset: 4px;
            font-weight: bold;
          }

          :scope .count {
            display: inline-block;
            border-radius: 9999px;
            margin-left: 0.25rem;
            background-color: var(--neutral-200);
            padding: 0 0.5rem;
            font-weight: bold;
          }

          :scope button {
            position: absolute;
            top: 0;
            right: 0;
            padding: 0.25rem 0.75rem;
          }

          :scope button:hover {
            background-color: var(--neutral-0);
          }
        </style>

        <span
          class="title"
          contenteditable
          onblur=${(event) => {
            actions.updateLane(lane, event.currentTarget.textContent);
          }}
        >
          ${lane.name}
        </span>

        <span class="count">${lane.tasks.length}</span>

        <button
          type="button"
          title="Remove lane"
          onclick=${() => actions.removeLane(lane)}
        >
          ×
        </button>
      </div>

      <div>
        <style>
          :scope .new-task {
            margin-top: 0.75rem;
            margin-bottom: 0.25rem;
          }

          :scope .new-task .text:empty {
            cursor: text;
          }

          :scope .new-task .text:empty::after {
            content: 'What needs doing?';
            color: var(--neutral-400);
          }
        </style>

        <${Task}
          class="new-task"
          textClass="text"
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
        />
      </div>
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
