exports.parseFormData = (encodedQueryString) => {
  const formData = {};
  // const numberOfTimesProcessed = {};

  const pathValuePairs = encodedQueryString.split('&');
  pathValuePairs.forEach((pathValuePair, index) => {
    const [encodedPath, value] = pathValuePair.split('=');
    const path = decodeURIComponent(encodedPath);
    const arrayKeys = path.split('[]');

    // numberOfTimesProcessed[path] ??= 0;

    let data = formData;
    arrayKeys.forEach((arrayKey, index) => {
      const objectKeys = arrayKey
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(/\]?\[/);

      // We have to go deeper 👀
      objectKeys.slice(0, -1).forEach((objectKey) => {
        data[objectKey] ??= {};
        data = data[objectKey];
      });

      const key = objectKeys.at(-1);

      // Initialize array
      if (index < arrayKeys.length - 1) {
        data[key] ??= [];
        data = data[key];
        return;
      }

      // Set primitive array value
      if (key === '') {
        data.push(value);
        return;
      }

      // Get relevant array element
      if (Array.isArray(data)) {
        if (data.length === 0 || data.at(-1)[key] !== undefined) {
          data.push({ [key]: value });
        }
        data = data.at(-1);
      }

      // Set primitive value
      if (data[key] === undefined) {
        data[key] = value;
      } else {
        // TODO
      }
    });
  });

  return formData;
};
