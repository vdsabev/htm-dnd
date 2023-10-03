import assert from 'assert';
import actions from './actions.js';

const suite = {
  addLane: {
    'should return new lane'() {
      assert.deepStrictEqual(
        actions.addLane.call({ lanes: [] }),
        //
        { lanes: [{ name: 'New Lane', tasks: [] }] }
      );
    },
  },
};

for (const [description, tests] of Object.entries(suite)) {
  console.log(description);
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
