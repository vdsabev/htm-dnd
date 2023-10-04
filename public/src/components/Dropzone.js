import { html } from '../../lib/preact';

export default ({ moveTask, children }) => html`
  <div
    class="py-1 after:block after:h-2 after:rounded-sm [&[data-dragenter]]:after:bg-gradient-to-r after:from-sky-700 after:via-sky-400 after:to-sky-700 last:h-full"
    ondragover=${(event) => {
      // Set dragover to trigger dropzone when hovering over child elements
      event.preventDefault();
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragenter=${(event) => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setAttribute('data-dragenter', true);
    }}
    ondragleave=${(event) => {
      event.stopPropagation();
      event.currentTarget.removeAttribute('data-dragenter');
    }}
    ondrop=${(event) => {
      event.currentTarget.removeAttribute('data-dragenter');
      const taskId = event.dataTransfer.getData('text/plain');
      moveTask(taskId);
    }}
  >
    ${children}
  </div>
`;
