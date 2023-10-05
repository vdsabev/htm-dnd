import { html } from '../../lib/preact.js';

import Dropzone from './Dropzone.js';
import Lane from './Lane.js';

export default ({ board, actions }) => html`
  <${Dropzone}
    type="lane"
    direction="vertical"
    move=${(lane) => actions.moveLane(lane, 0)}
  />

  ${board.lanes.map(
    (lane, index) => html`
      <${Lane} lane=${lane} actions=${actions} />
      <${Dropzone}
        type="lane"
        direction="vertical"
        move=${(lane) => actions.moveLane(lane, index + 1)}
      />
    `
  )}

  <div>
    <style>
      :scope {
        min-width: var(--lane-width);
      }

      :scope button {
        border-radius: 4px;
        border-width: 1px;
        background-color: var(--neutral-0);
        padding: 0.75rem;
        transition: padding 150ms ease-in-out;
      }

      :scope button:hover {
        padding-right: calc(var(--lane-width) - 2.5rem);
      }
    </style>

    <button
      type="button"
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
