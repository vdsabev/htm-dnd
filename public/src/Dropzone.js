import html from 'html';

export default ({ moveTask }, children) => html`
  <div
    class="py-1 after:block after:h-2 after:rounded-sm [&[data-dragenter]]:after:bg-gradient-to-r after:from-sky-700 after:via-sky-400 after:to-sky-700 last:h-full"
    ondragover=${function () {
      // Set dragover to trigger dropzone when hovering over child elements
      event.preventDefault();
      if (!this.hasAttribute('data-dragenter')) {
        // Prevents flickering
        this.setAttribute('data-dragenter', true);
      }
    }}
    ondragenter=${function () {
      event.preventDefault();
      event.stopPropagation();
      this.setAttribute('data-dragenter', true);
    }}
    ondragleave=${function () {
      event.stopPropagation();
      this.removeAttribute('data-dragenter');
    }}
    ondrop=${function () {
      this.removeAttribute('data-dragenter');
      const taskId = event.dataTransfer.getData('text/plain');
      moveTask(taskId);
    }}
  >
    ${children}
  </div>
`;
