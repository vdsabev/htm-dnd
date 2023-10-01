const queryString = require('query-string');
exports.parseFormData = (/** @type {string} */ value) =>
  queryString.parse(value, { arrayFormat: 'bracket' });

// const assert = require('assert');

// exports.parseFormData = (encodedQueryString) => {
//   const formData = {};
//   const numberOfTimesProcessed = {};

//   const pathValuePairs = encodedQueryString.split('&');
//   pathValuePairs.forEach((pathValuePair, index) => {
//     const [encodedPath, value] = pathValuePair.split('=');
//     const path = decodeURIComponent(encodedPath);
//     const parts = path.split('[]');

//     numberOfTimesProcessed[path] ??= 0;

//     let currentValue = formData;
//     parts.forEach((part, index) => {
//       const key = part.replace('[', '').replace(']', '');
//       if (index < parts.length - 1) {
//         if (Array.isArray(currentValue)) {
//           if (numberOfTimesProcessed[path] < currentValue.length) {
//             currentValue = currentValue.at(-1);
//           } else {
//             currentValue.push({ [key]: [] });
//             currentValue = currentValue.at(-1)[key];
//           }
//         } else {
//           currentValue[key] ??= [];
//           currentValue = currentValue[key];
//         }
//       } else {
//         if (Array.isArray(currentValue)) {
//           if (numberOfTimesProcessed[path] < currentValue.length) {
//             currentValue.at(-1)[key] = value;
//           } else {
//             currentValue.push({ [key]: value });
//           }
//         } else {
//           currentValue[key] = value;
//         }
//       }
//     });

//     numberOfTimesProcessed[path] += 1;
//   });
//   console.log(JSON.stringify(formData, null, 2)); // TODO: Remove

//   return formData;
// };

// // Tests
// assert.deepEqual(
//   {
//     lanes: [
//       {
//         // _id: 'A',
//         // name: 'Lane A',
//         tasks: [
//           { _id: 'A1', text: 'Task A1' },
//           // { _id: 'A2', text: 'Task A2' },
//           // { _id: 'A3', text: 'Task A3' },
//         ],
//       },
//       {
//         // _id: 'B',
//         // name: 'Lane B',
//         tasks: [
//           { _id: 'B1', text: 'Task B1' },
//           // { _id: 'B2', text: 'Task B2' },
//         ],
//       },
//       // {
//       //   _id: 'C',
//       //   name: 'Lane C',
//       //   tasks: [{ _id: 'C1', text: 'Task C1' }],
//       // },
//     ],
//   },
//   exports.parseFormData(
//     [
//       // 'lanes[][_id]=A',
//       // 'lanes[][name]=Lane A',
//       'lanes[][tasks][][_id]=A1',
//       'lanes[][tasks][][text]=Task A1',
//       // 'lanes[][tasks][][_id]=A2',
//       // 'lanes[][tasks][][text]=Task A2',
//       // 'lanes[][tasks][][_id]=A3',
//       // 'lanes[][tasks][][text]=Task A3',
//       // 'lanes[][_id]=B',
//       // 'lanes[][name]=Lane B',
//       'lanes[][tasks][][_id]=B1',
//       'lanes[][tasks][][text]=Task B1',
//       // 'lanes[][tasks][][_id]=B2',
//       // 'lanes[][tasks][][text]=Task B2',
//       // 'lanes[][_id]=C',
//       // 'lanes[][name]=Lane C',
//       // 'lanes[][tasks][][_id]=C1',
//       // 'lanes[][tasks][][text]=Task C1',
//     ].join('&')
//   ),
//   'Unexpected parsed form data'
// );
