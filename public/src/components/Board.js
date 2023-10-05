import { html } from '../../lib/preact.js';

import Dropzone from './Dropzone.js';
import Lane from './Lane.js';

export default ({ board, actions }) => html`
  <${Dropzone}
    direction="vertical"
    move=${(laneId) => actions.moveLane(laneId, 0)}
  />

  ${board.lanes.map(
    (lane, index) => html`
      <${Lane} lane=${lane} actions=${actions} />
      <${Dropzone}
        direction="vertical"
        move=${(laneId) => actions.moveLane(laneId, index + 1)}
      />
    `
  )}

  <div class="min-w-[var(--lane-width)]">
    <button
      type="button"
      class="self-start p-3 bg-white border rounded text-left hover:pr-[calc(var(--lane-width)-2.5rem)] transition-[padding]"
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
