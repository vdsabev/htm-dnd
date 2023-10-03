import assert from 'assert';
import actions from './actions.js';

const data = {
  empty: { lanes: [] },
  default: {
    lanes: [
      { name: 'A', tasks: [] },
      { name: 'B', tasks: [] },
      { name: 'C', tasks: [] },
    ],
  },
};

const suite = {
  addLane: {
    'should return new lane'() {
      assert.deepStrictEqual(
        actions.addLane.call(data.empty), //
        { lanes: [{ name: 'New Lane', tasks: [] }] }
      );
    },
  },

  removeLane: {
    'should remove existing lane'() {
      assert.deepStrictEqual(
        actions.removeLane.call(data.default, data.default.lanes[0]),
        { ...data.default, lanes: data.default.lanes.slice(1) }
      );
    },

    'should not remove non-existing lane'() {
      assert.deepStrictEqual(
        actions.removeLane.call(data.default, {}),
        data.default
      );
    },
  },

  updateLane: {
    'should update existing lane name'() {
      assert.deepStrictEqual(
        actions.updateLane.call(data.default, data.default.lanes[0], 'D'),
        {
          ...data.default,
          lanes: [{ name: 'D', tasks: [] }, ...data.default.lanes.slice(1)],
        }
      );
    },

    'should not update non-existing lane'() {
      assert.deepStrictEqual(
        actions.updateLane.call(data.default, { name: 'D', tasks: [] }, 'D'),
        data.default
      );
    },
  },
};

for (const [description, tests] of Object.entries(suite)) {
  console.log(`\n${description}`);
  for (const [message, test] of Object.entries(tests)) {
    try {
      test();
      console.log(`✅ ${message}`);
    } catch (error) {
      console.error(`❌ ${message}`);
      console.error(error);
    }
  }
}
