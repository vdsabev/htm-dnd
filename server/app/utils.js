const assert = require('assert');

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

// Tests
assert.deepEqual(
  exports.parseFormData(['first=Albert', 'last=Einstein'].join('&')),
  { first: 'Albert', last: 'Einstein' },
  'Failed to parse object'
);

assert.deepEqual(
  exports.parseFormData(['names[]=Alice', 'names[]=Bob'].join('&')),
  { names: ['Alice', 'Bob'] },
  'Failed to parse array'
);

assert.deepEqual(
  exports.parseFormData(
    ['names[first]=Albert', 'names[last]=Einstein'].join('&')
  ),
  { names: { first: 'Albert', last: 'Einstein' } },
  'Failed to parse nested object'
);

assert.deepEqual(
  exports.parseFormData(
    [
      'names[][first]=Albert',
      'names[][last]=Einstein',
      'names[][first]=Carl',
      'names[][last]=Sagan',
    ].join('&')
  ),
  {
    names: [
      { first: 'Albert', last: 'Einstein' },
      { first: 'Carl', last: 'Sagan' },
    ],
  },
  'Failed to parse array with objects'
);

assert.deepEqual(
  exports.parseFormData(
    [
      'lanes[][_id]=A',
      'lanes[][name]=Lane A',
      'lanes[][tasks][][_id]=A1',
      'lanes[][tasks][][text]=Task A1',
      'lanes[][tasks][][_id]=A2',
      'lanes[][tasks][][text]=Task A2',
      'lanes[][tasks][][_id]=A3',
      'lanes[][tasks][][text]=Task A3',
      'lanes[][_id]=B',
      'lanes[][name]=Lane B',
      'lanes[][tasks][][_id]=B1',
      'lanes[][tasks][][text]=Task B1',
      'lanes[][tasks][][_id]=B2',
      'lanes[][tasks][][text]=Task B2',
      'lanes[][_id]=C',
      'lanes[][name]=Lane C',
      'lanes[][tasks][][_id]=C1',
      'lanes[][tasks][][text]=Task C1',
    ].join('&')
  ),
  {
    lanes: [
      {
        _id: 'A',
        name: 'Lane A',
        tasks: [
          { _id: 'A1', text: 'Task A1' },
          { _id: 'A2', text: 'Task A2' },
          { _id: 'A3', text: 'Task A3' },
        ],
      },
      {
        _id: 'B',
        name: 'Lane B',
        tasks: [
          { _id: 'B1', text: 'Task B1' },
          { _id: 'B2', text: 'Task B2' },
        ],
      },
      {
        _id: 'C',
        name: 'Lane C',
        tasks: [{ _id: 'C1', text: 'Task C1' }],
      },
    ],
  },
  'Failed to parse form data'
);
