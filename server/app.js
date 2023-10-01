const constants = require('./app/constants');
const db = require('./app/db');
const Page = require('./app/layouts/Page');
const App = require('./app/pages/app');
const utils = require('./app/utils');

exports.handler = async (request, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // https://mongoosejs.com/docs/lambda.html

  request.path = request.path.replace(/^\//, ''); // Normalize path by removing starting slash

  // Task board
  if (request.path) {
    // TODO: Create a new data record if the ID doesn't exist

    const [dataId, laneId] = request.path.split('/');

    // Get task page
    if (request.httpMethod === 'GET') {
      const data = await db.getDataForId(dataId);
      return response.html(
        await Page({ body: await App({ data, constants }) })
      );
    }

    // Update data
    if (request.httpMethod === 'PUT') {
      const formData = utils.parseFormData(request.body);
      const updatedData = await db.setDataForId(dataId, formData);
      return response.html(await App({ data: updatedData, constants }));
    }

    // Add lane
    if (request.httpMethod === 'POST') {
      const updatedData = await db.addLane(dataId);
      return response.html(await App({ data: updatedData, constants }));
    }

    // Delete lane
    if (request.httpMethod === 'DELETE') {
      const updatedData = await db.deleteLane(dataId, laneId);
      return response.html(await App({ data: updatedData, constants }));
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
