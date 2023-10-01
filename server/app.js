const ejs = require('ejs');

const Page = require('./app/layouts/Page');
const db = require('./app/db');

exports.handler = async (request, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // https://mongoosejs.com/docs/lambda.html

  request.path = request.path.replace(/^\//, ''); // Normalize path by removing starting slash

  // Task board
  if (request.httpMethod === 'GET' && request.path && request.path.split('/')[0] !== 'pages') {
    return response.html(
      await Page({
        body: await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
          data: await db.getDataForId(request.path),
        }),
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
