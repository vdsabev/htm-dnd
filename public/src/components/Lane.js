import { html } from '../../lib/preact.js';

import Dropzone from './Dropzone.js';
import Task from './Task.js';

// TODO: Allow reordering lanes
export default ({ lane, actions }) => html`
  <div
    class="relative flex flex-col min-w-[var(--lane-width)] border rounded w-[var(--lane-width)] bg-slate-100 px-3 shadow-inner overflow-y-auto"
  >
    <${Dropzone} moveTask=${(taskId) => actions.moveTask(taskId, lane, 0)}>
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
          moveTask=${(taskId) => actions.moveTask(taskId, lane, index + 1)}
        />
      `
    )}
  </div>
`;
