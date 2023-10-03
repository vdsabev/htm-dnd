const createHttpHandlerWithMethod =
  (/** @type {string} */ method) =>
  async (/** @type {string} */ url, /** @type {RequestInit} */ options) => {
    const response = await fetch(url, { ...options, method });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    if (200 <= response.status && response.status < 300) {
      return response.headers.get('Content-Type') === 'application/json'
        ? response.json()
        : response.text();
    }
  };

const http = {
  delete: createHttpHandlerWithMethod('DELETE'),
  get: createHttpHandlerWithMethod('GET'),
  patch: createHttpHandlerWithMethod('PATCH'),
  post: createHttpHandlerWithMethod('POST'),
  put: createHttpHandlerWithMethod('PUT'),
};

export default http;
