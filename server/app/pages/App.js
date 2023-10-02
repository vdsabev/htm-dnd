const ejs = require('ejs');

module.exports = (data) => ejs.renderFile(`${__dirname}/app.html`, data);
