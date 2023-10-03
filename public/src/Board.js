import html from 'html';
import Lane from './Lane.js';

export default ({ board }) => html`
  <div class="flex h-full gap-4 p-4">
    ${board.lanes.map((lane) => html`<${Lane} lane=${lane} />`)}

    <div class="min-w-[var(--lane-width)]">
      <button
        type="button"
        class="self-start p-3 bg-white border rounded text-left hover:pr-[calc(var(--lane-width)-2.5rem)] transition-[padding]"
        onclick=${board.addLane}
      >
        ➕
      </button>
    </div>
  </div>
`;
