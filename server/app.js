const ejs = require('ejs');
const Page = require('./app/layouts/Page');

exports.handler = async (request, context) => {
  request.path = request.path.replace(/^\//, ''); // Normalize path by removing starting slash

  // Pages
  if (request.httpMethod === 'GET' && request.path === '') {
    return response.html(
      await Page({
        body: await ejs.renderFile(`${__dirname}/app/pages/app/get.html`),
      })
    );
  }

  // Automatic page routes
  try {
    return response.html(
      await ejs.renderFile(
        `${__dirname}/app/${
          request.path
        }/${request.httpMethod.toLowerCase()}.html`
      )
    );
  } catch (error) {
    console.error(error);
    return error.code === 'ENOENT'
      ? response.notFound()
      : response.internalServerError();
  }
};

const response = {
  html(body) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: Array.isArray(body) ? body.join('') : body,
    };
  },
  notFound() {
    return {
      ...response.html('Not Found'),
      statusCode: 404,
    };
  },
  internalServerError() {
    return {
      ...response.html('Internal Server Error'),
      statusCode: 500,
    };
  },
};
