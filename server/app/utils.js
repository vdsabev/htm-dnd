exports.parseFormData = (encodedQueryString) => {
  const formData = {};

  const pathValuePairs = encodedQueryString.split('&');
  pathValuePairs.forEach((pathValuePair) => {
    const [encodedPath, value] = pathValuePair.split('=');
    const path = decodeURIComponent(encodedPath);
    const arrayKeys = path.split('[]');

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
        if (Array.isArray(data)) {
          data.at(-1)[key] ??= [];
          data = data.at(-1)[key];
        } else {
          data[key] ??= [];
          data = data[key];
        }
        return;
      }

      // Set primitive array value
      if (key === '') {
        data.push(value);
        return;
      }

      // Get relevant array item
      if (Array.isArray(data)) {
        if (data.length === 0 || data.at(-1)[key] !== undefined) {
          data.push({ [key]: value });
        }
        data = data.at(-1);
      }

      // Set primitive value
      if (data[key] === undefined) {
        data[key] = value;
      }
    });
  });

  return formData;
};
