const ejs = require('ejs');
const path = require('path');

exports.App = (data) => ejs.renderFile(path.join(__dirname, 'app.html'), data);

exports.Task = (data) =>
  ejs.renderFile(path.join(__dirname, 'task.html'), data);
