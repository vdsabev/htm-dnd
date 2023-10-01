const assert = require('assert');
const utils = require('./utils');

// Tests
assert.deepEqual(
  utils.parseFormData(['first=Albert', 'last=Einstein'].join('&')),
  { first: 'Albert', last: 'Einstein' },
  'Failed to parse object'
);

assert.deepEqual(
  utils.parseFormData(['names[]=Alice', 'names[]=Bob'].join('&')),
  { names: ['Alice', 'Bob'] },
  'Failed to parse array'
);

assert.deepEqual(
  utils.parseFormData(
    ['names[first]=Albert', 'names[last]=Einstein'].join('&')
  ),
  { names: { first: 'Albert', last: 'Einstein' } },
  'Failed to parse nested object'
);

assert.deepEqual(
  utils.parseFormData(
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
  utils.parseFormData(
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
