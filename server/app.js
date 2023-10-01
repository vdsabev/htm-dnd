const ejs = require('ejs');

const Page = require('./app/layouts/Page');
const constants = require('./app/constants');
const db = require('./app/db');

exports.handler = async (request, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // https://mongoosejs.com/docs/lambda.html

  request.path = request.path.replace(/^\//, ''); // Normalize path by removing starting slash

  // Task board
  if (request.path) {
    const [dataId, laneId] = request.path.split('/');

    if (request.httpMethod === 'GET') {
      return response.html(
        await Page({
          body: await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
            data: await db.getDataForId(dataId),
            constants,
          }),
        })
      );
    }

    if (request.httpMethod === 'POST') {
      const updatedData = await db.addNewLane(dataId);
      return response.html(
        await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
          data: updatedData,
          constants,
        })
      );
    }

    if (request.httpMethod === 'PUT') {
      const body = JSON.parse(request.body);
      await db.setDataForId(dataId, body);
      return response.noContent(); // TODO: Render page
    }

    if (request.httpMethod === 'DELETE') {
      const updatedData = await db.deleteLane(dataId, laneId);
      return response.html(
        await ejs.renderFile(`${__dirname}/app/pages/app/get.html`, {
          data: updatedData,
          constants,
        })
      );
    }
  }

  return response.notFound();
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
};
