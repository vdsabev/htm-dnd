const ejs = require('ejs');

exports.App = (data) => ejs.renderFile(`${__dirname}/app.html`, data);
exports.Lane = (data) => ejs.renderFile(`${__dirname}/lane.html`, data);
exports.Task = (data) => ejs.renderFile(`${__dirname}/task.html`, data);
exports.Dropzone = (data) => ejs.renderFile(`${__dirname}/dropzone.html`, data);
