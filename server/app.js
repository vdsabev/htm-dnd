const ejs = require('ejs');

const Page = require('./app/layouts/Page');
const constants = require('./app/constants');
const db = require('./app/db');

exports.handler = async (request, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // https://mongoosejs.com/docs/lambda.html

  request.path = request.path.replace(/^\//, ''); // Normalize path by removing starting slash

  // Task board
  if (request.path && request.path.split('/')[0] !== 'pages') {
    if (request.httpMethod === 'GET') {
      return response.html(
        await Page({
          body: await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
            data: await db.getDataForId(request.path),
            constants,
          }),
        })
      );
    }

    if (request.httpMethod === 'POST') {
      try {
        const updatedData = await db.addNewLane(request.path);
        console.log(updatedData);
        return response.html(
          await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
            data: updatedData,
            constants,
          })
        );
      } catch (error) {
        console.error(error);
        return response.badRequest();
      }
    }

    if (request.httpMethod === 'PUT') {
      try {
        const body = JSON.parse(request.body);
        await db.setDataForId(request.path, body);
        return response.noContent();
      } catch (error) {
        console.error(error);
        return response.badRequest();
      }
    }
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
  noContent() {
    return {
      ...response.html('No Content'),
      statusCode: 204,
    };
  },
  badRequest() {
    return {
      ...response.html('Bad Request'),
      statusCode: 400,
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
