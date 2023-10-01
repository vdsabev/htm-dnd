const ejs = require('ejs');

module.exports = (data) => ejs.renderFile(`${__dirname}/get.html`, data);
