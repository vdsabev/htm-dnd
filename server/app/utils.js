const assert = require('assert');

exports.parseFormData = (encodedQueryString) => {
  const formData = {};
  const numberOfTimesProcessed = {};

  const pathValuePairs = encodedQueryString.split('&');
  pathValuePairs.forEach((pathValuePair, index) => {
    const [encodedPath, value] = pathValuePair.split('=');
    const path = decodeURIComponent(encodedPath);
    const arrayKeys = path.split('[]');

    numberOfTimesProcessed[path] ??= 0;

    let currentValue = formData;
    arrayKeys.forEach((arrayKey, index) => {
      if (index < arrayKeys.length - 1) {
        currentValue[arrayKey] ??= [];
        currentValue = currentValue[arrayKey];
      } else if (arrayKey === '') {
        currentValue.push(value);
      } else {
        const objectKeys = arrayKey
          .split('[')
          .map((key) => key.replace(']', ''));

        objectKeys.slice(0, -1).forEach((objectKey) => {
          currentValue[objectKey] ??= {};
          currentValue = currentValue[objectKey];
        });
        currentValue[objectKeys.at(-1)] = value;
      }
    });

    numberOfTimesProcessed[path] += 1;
  });

  return formData;
};

// Tests
assert.deepEqual(
  exports.parseFormData(['a=1', 'b=2'].join('&')),
  { a: '1', b: '2' },
  'Failed to parse shallow object'
);

assert.deepEqual(
  exports.parseFormData(['a[]=1', 'a[]=2'].join('&')),
  { a: ['1', '2'] },
  'Failed to parse shallow array'
);

assert.deepEqual(
  exports.parseFormData(
    ['names[first]=Albert', 'names[last]=Einstein'].join('&')
  ),
  { names: { first: 'Albert', last: 'Einstein' } },
  'Failed to parse nested object'
);

// assert.deepEqual(
//   {
//     lanes: [
//       { _id: 'A', name: 'Lane A' },
//       { _id: 'B', name: 'Lane B' },
//     ],
//   },
//   exports.parseFormData(
//     [
//       'lanes[][_id]=A',
//       'lanes[][name]=Lane A',
//       'lanes[][_id]=B',
//       'lanes[][name]=Lane B',
//     ].join('&')
//   ),
//   'Failed to parse shallow array'
// );

// assert.deepEqual(
//   {
//     lanes: [
//       {
//         tasks: [{ _id: 'A1', text: 'Task A1' }],
//       },
//       {
//         tasks: [{ _id: 'B1', text: 'Task B1' }],
//       },
//     ],
//   },
//   exports.parseFormData(
//     [
//       'lanes[][tasks][][_id]=A1',
//       'lanes[][tasks][][text]=Task A1',
//       'lanes[][tasks][][_id]=B1',
//       'lanes[][tasks][][text]=Task B1',
//     ].join('&')
//   ),
//   'Failed to parse nested arrays'
// );

// assert.deepEqual(
//   {
//     lanes: [
//       {
//         _id: 'A',
//         name: 'Lane A',
//         tasks: [
//           { _id: 'A1', text: 'Task A1' },
//           { _id: 'A2', text: 'Task A2' },
//           { _id: 'A3', text: 'Task A3' },
//         ],
//       },
//       {
//         _id: 'B',
//         name: 'Lane B',
//         tasks: [
//           { _id: 'B1', text: 'Task B1' },
//           { _id: 'B2', text: 'Task B2' },
//         ],
//       },
//       {
//         _id: 'C',
//         name: 'Lane C',
//         tasks: [{ _id: 'C1', text: 'Task C1' }],
//       },
//     ],
//   },
//   exports.parseFormData(
//     [
//       'lanes[][_id]=A',
//       'lanes[][name]=Lane A',
//       'lanes[][tasks][][_id]=A1',
//       'lanes[][tasks][][text]=Task A1',
//       'lanes[][tasks][][_id]=A2',
//       'lanes[][tasks][][text]=Task A2',
//       'lanes[][tasks][][_id]=A3',
//       'lanes[][tasks][][text]=Task A3',
//       'lanes[][_id]=B',
//       'lanes[][name]=Lane B',
//       'lanes[][tasks][][_id]=B1',
//       'lanes[][tasks][][text]=Task B1',
//       'lanes[][tasks][][_id]=B2',
//       'lanes[][tasks][][text]=Task B2',
//       'lanes[][_id]=C',
//       'lanes[][name]=Lane C',
//       'lanes[][tasks][][_id]=C1',
//       'lanes[][tasks][][text]=Task C1',
//     ].join('&')
//   ),
//   'Failed to parse form data'
// );
