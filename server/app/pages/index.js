const ejs = require('ejs');

exports.App = (data) => ejs.renderFile(`${__dirname}/app.html`, data);

exports.Task = (data) => ejs.renderFile(`${__dirname}/task.html`, data);
