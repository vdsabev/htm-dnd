import html from 'html';
import Lane from './Lane.js';

export default ({ board }) => html`
  <div class="flex h-full gap-4 p-4">
    ${board.lanes.map((lane) => html`<${Lane} lane=${lane} moveTask=${board.moveTask} />`)}

    <div class="min-w-[var(--lane-width)]">
      <button
        type="button"
        class="self-start p-3 bg-white border rounded text-left hover:pr-[calc(var(--lane-width)-2.5rem)] transition-[padding]"
        onclick=${function () {
          board.addLane();
          // TODO: Scroll into view, except the element doesn't exist anymore after re-rendering
          this.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        ➕
      </button>
    </div>
  </div>
`;
