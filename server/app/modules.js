const fs = require('fs');
const html = require('./html');

const cache = {};

exports.import = (path, data) => html`
  <script
    dangerouslySetInnerHTML=${{
      __html: (cache[path] ||= fs
        .readFileSync(path, 'utf-8')
        .replaceAll(new ObjectReplacer(data))),
    }}
  ></script>
`;

class ObjectReplacer {
  constructor(data) {
    this.data = data;
  }

  [Symbol.replace](string) {
    for (const key in this.data) {
      string = string.replace(key, this.data[key]);
    }
    return string;
  }
}
