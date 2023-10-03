const ejs = require('ejs');
const html = require('../html');

module.exports = ({ head = '', body = '' } = {}) =>
  ejs.renderFile(`${__dirname}/layout.html`, {
    title: 'htmx dnd',
    favicon: html`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐴</text></svg>`,
    head: html`
      ${head}
      <link href="/style.css" rel="stylesheet" />
    `,
    body: html`
      ${body}
      <div
        class="fixed bottom-0 rounded-t bg-purple-600 text-white px-2 py-1 text-center"
        style="left: calc(50% - 200px); right: calc(50% - 200px); font-variant: small-caps"
      >
        made with 💻 by
        <a
          class="mx-1 font-bold"
          href="https://twitter.com/vdsabev"
          target="_blank"
        >
          @vdsabev
        </a>
      </div>
    `,
  });
