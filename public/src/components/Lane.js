import { html } from 'html';

import Dropzone from './Dropzone.js';
import Task from './Task.js';

export default ({ lane, removeLane, moveTask }) => html`
  <div
    class="relative flex flex-col min-w-[var(--lane-width)] border rounded w-[var(--lane-width)] bg-slate-100 px-3 shadow-inner overflow-y-auto"
  >
    <button
      type="button"
      class="absolute px-3 py-1 border-transparent rounded-full top-2 right-1 hover:bg-white hover:border-slate-500"
      title="Remove lane"
      onclick=${() => removeLane(lane)}
    >
      ×
    </button>

    <${Dropzone} moveTask=${(taskId) => moveTask(taskId, lane, 0)}>
      <div class="pt-2 font-bold">
        ${lane.name}
        <span class="inline-block ml-1 px-2 rounded-full bg-slate-200">
          ${lane.tasks.length}
        </span>
      </div>
    <//>

    ${lane.tasks.map(
      (task, index) => html`
        <${Task} task=${task} />
        <${Dropzone}
          moveTask=${(taskId) => moveTask(taskId, lane, index + 1)}
        />
      `
    )}
  </div>
`;
