const createHttpHandlerWithMethod = (method) => async (url, options) => {
  const response = await fetch(url, { ...options, method });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  if (response.status === 200) {
    return response.headers.get('Content-Type') === 'application/json'
      ? response.json()
      : response.text();
  }
  return undefined;
};

const http = {
  delete: createHttpHandlerWithMethod('DELETE'),
  get: createHttpHandlerWithMethod('GET'),
  patch: createHttpHandlerWithMethod('PATCH'),
  post: createHttpHandlerWithMethod('POST'),
  put: createHttpHandlerWithMethod('PUT'),
};

export default http;
