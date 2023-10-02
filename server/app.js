const pathern = require('pathern');
const routes = require('./app/routes');

exports.handler = async (request, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // https://mongoosejs.com/docs/lambda.html
  request.path ||= '/'; // Normalize path

  const handler = Object.keys(routes).reduce((handler, path) => {
    if (handler) return handler;

    if (pathern.matches(path, request.path)) {
      request.params = pathern.extract(path, request.path);
      return routes[path][request.httpMethod.toLowerCase()];
    }
  }, null);

  return (handler || response.notFound)(request, response);
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
