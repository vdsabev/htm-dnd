const assert = require('assert');
const utils = require('./utils');
const ObjectId = (value) => value; // Make last test easy to import into MongoDB

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

assert.deepEqual(
  utils.parseFormData(
    'lanes%5B%5D%5B_id%5D=651952a7e8b0a1d2519bf4bb&lanes%5B%5D%5Bname%5D=%E2%9B%8F%EF%B8%8F%20To%20Do&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f1f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Ignore%20the%20haters%20%F0%9F%91%8A&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f2f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Post%20dank%20memes%20on%20htmx%20Discord%20%F0%9F%AB%A1&lanes%5B%5D%5B_id%5D=651952a7e8b0a1d2519bf4bc&lanes%5B%5D%5Bname%5D=%E2%8F%B3%20In%20Progress&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f3f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Code%20with%20hypermedia%2Fhtmx%20%F0%9F%90%B4%0A(same%20thing)&lanes%5B%5D%5B_id%5D=651952a7e8b0a1d2519bf4bd&lanes%5B%5D%5Bname%5D=%E2%9C%85%20Done&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f4f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Drink%20coffee%20%F0%9F%8D%B5&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f6f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Stretch%20%F0%9F%8F%83&lanes%5B%5D%5Btasks%5D%5B%5D%5B_id%5D=6519418024dcd715e1b25f7f&lanes%5B%5D%5Btasks%5D%5B%5D%5Btext%5D=Wake%20up%20%F0%9F%8C%9E'
  ),
  {
    lanes: [
      {
        name: '⛏️ To Do',
        tasks: [
          {
            _id: ObjectId('6519418024dcd715e1b25f1f'),
            text: 'Ignore the haters 👊',
          },
          {
            _id: ObjectId('6519418024dcd715e1b25f2f'),
            text: 'Post dank memes on htmx Discord 🫡',
          },
        ],
        _id: ObjectId('651952a7e8b0a1d2519bf4bb'),
      },
      {
        name: '⏳ In Progress',
        tasks: [
          {
            _id: ObjectId('6519418024dcd715e1b25f3f'),
            text: 'Code with hypermedia/htmx 🐴\n(same thing)',
          },
        ],
        _id: ObjectId('651952a7e8b0a1d2519bf4bc'),
      },
      {
        name: '✅ Done',
        tasks: [
          {
            _id: ObjectId('6519418024dcd715e1b25f4f'),
            text: 'Drink coffee 🍵',
          },
          {
            _id: ObjectId('6519418024dcd715e1b25f6f'),
            text: 'Stretch 🏃',
          },
          {
            _id: ObjectId('6519418024dcd715e1b25f7f'),
            text: 'Wake up 🌞',
          },
        ],
        _id: ObjectId('651952a7e8b0a1d2519bf4bd'),
      },
    ],
  },
  'Failed to parse encoded form data'
);
