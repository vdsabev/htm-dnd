exports.parseBoolean = (string) =>
  string === 'true' ? true : string === 'false' ? false : undefined;

exports.safelyParseJSON = (string) => {
  try {
    return string ? JSON.parse(string) : null;
  } catch (error) {
    // Be forgiving of the occasional error
    console.error('Invalid JSON:', string);
  }
};
