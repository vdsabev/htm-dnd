import { html } from '../../lib/preact.js';

import Lane from './Lane.js';

export default ({ board, actions }) => html`
  ${board.lanes.map(
    (lane) => html`<${Lane} lane=${lane} actions=${actions} />`
  )}

  <div class="min-w-[var(--lane-width)]">
    <button
      type="button"
      class="self-start p-10 bg-white border rounded text-left hover:pr-[calc(var(--lane-width)-2.5rem)] transition-[padding]"
      onclick=${(event) => {
        actions.addLane();
        event.currentTarget.scrollIntoView({ behavior: 'smooth' });
      }}
      title="Add lane"
    >
      ➕
    </button>
  </div>
`;
