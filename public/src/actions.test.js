import assert from 'assert';
import actions from './actions.js';

const data = {
  empty: { lanes: [] },
  withLanes: {
    lanes: [
      { _id: '1', name: 'A', tasks: [] },
      { _id: '2', name: 'B', tasks: [] },
      { _id: '3', name: 'C', tasks: [] },
    ],
  },
  withTasks: {
    lanes: [
      {
        _id: '1',
        name: 'A',
        tasks: [
          { _id: '1', text: 'Task A1' },
          { _id: '2', text: 'Task A2' },
          { _id: '3', text: 'Task A3' },
        ],
      },
      {
        _id: '2',
        name: 'B',
        tasks: [
          { _id: '4', text: 'Task B1' },
          { _id: '5', text: 'Task B2' },
        ],
      },
      {
        _id: '3',
        name: 'C',
        tasks: [{ _id: '6', text: 'Task C1' }],
      },
    ],
  },
};

const suite = {
  // Lanes
  addLane: {
    'should add new lane'() {
      assert.deepStrictEqual(
        actions.addLane.call(data.empty), //
        { lanes: [{ name: 'New Lane', tasks: [] }] }
      );
    },
  },

  removeLane: {
    'should remove existing lane'() {
      assert.deepStrictEqual(
        actions.removeLane.call(data.withLanes, data.withLanes.lanes[0]),
        { lanes: data.withLanes.lanes.slice(1) }
      );
    },

    'should not remove non-existing lane'() {
      assert.deepStrictEqual(
        actions.removeLane.call(data.withLanes, {}),
        data.withLanes
      );
    },
  },

  updateLane: {
    'should update existing lane name'() {
      assert.deepStrictEqual(
        actions.updateLane.call(data.withLanes, data.withLanes.lanes[0], 'D'),
        {
          lanes: [
            { _id: '1', name: 'D', tasks: [] },
            ...data.withLanes.lanes.slice(1),
          ],
        }
      );
    },

    'should not update non-existing lane'() {
      assert.deepStrictEqual(
        actions.updateLane.call(data.withLanes, { name: 'D', tasks: [] }, 'D'),
        data.withLanes
      );
    },
  },

  // Tasks
  addTask: {
    'should add new task when text is provided'() {
      assert.deepStrictEqual(
        actions.addTask.call(
          data.withLanes,
          data.withLanes.lanes[0],
          'Task A1'
        ),
        {
          lanes: [
            {
              _id: '1',
              name: 'A',
              tasks: [{ text: 'Task A1' }],
            },
            ...data.withLanes.lanes.slice(1),
          ],
        }
      );
    },

    'should not change tasks when text is not provided'() {
      assert.deepStrictEqual(
        actions.addTask.call(data.withLanes, data.withLanes.lanes[0], ''),
        {}
      );
    },

    'should not change tasks for non-existent lane'() {
      assert.deepStrictEqual(
        actions.addTask.call(data.withLanes, {}, 'Task A1'),
        data.withLanes
      );
    },
  },

  updateTask: {
    'should update existing task when text is provided'() {
      assert.deepStrictEqual(
        actions.updateTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0],
          'Task A1 - edited'
        ),
        {
          lanes: [
            {
              _id: '1',
              name: 'A',
              tasks: [
                { _id: '1', text: 'Task A1 - edited' },
                ...data.withTasks.lanes[0].tasks.slice(1),
              ],
            },
            ...data.withTasks.lanes.slice(1),
          ],
        }
      );
    },

    'should remove existing task when text is not provided'() {
      assert.deepStrictEqual(
        actions.updateTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0],
          ''
        ),
        {
          lanes: [
            {
              _id: '1',
              name: 'A',
              tasks: data.withTasks.lanes[0].tasks.slice(1),
            },
            ...data.withTasks.lanes.slice(1),
          ],
        }
      );
    },

    'should not update non-existing task'() {
      assert.deepStrictEqual(
        actions.updateTask.call(
          data.withTasks,
          { text: 'Task D1' },
          'Task D1 - edited'
        ),
        data.withTasks
      );
    },
  },

  moveTask: {
    'should not move task before itself'() {
      assert.deepStrictEqual(
        actions.moveTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0]._id,
          data.withTasks.lanes[0],
          0
        ),
        data.withTasks
      );
    },

    'should not move task after itself'() {
      assert.deepStrictEqual(
        actions.moveTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0]._id,
          data.withTasks.lanes[0],
          1
        ),
        data.withTasks
      );
    },

    'should move first task to the end of the lane'() {
      assert.deepStrictEqual(
        actions.moveTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0]._id,
          data.withTasks.lanes[0],
          1000
        ),
        {
          lanes: [
            {
              ...data.withTasks.lanes[0],
              tasks: [
                ...data.withTasks.lanes[0].tasks.slice(1),
                data.withTasks.lanes[0].tasks[0],
              ],
            },
            ...data.withTasks.lanes.slice(1),
          ],
        }
      );
    },

    'should not move last task after the end'() {
      assert.deepStrictEqual(
        actions.moveTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks.at(-1)._id,
          data.withTasks.lanes[0],
          1000
        ),
        data.withTasks
      );
    },

    'should move task to another lane'() {
      assert.deepStrictEqual(
        actions.moveTask.call(
          data.withTasks,
          data.withTasks.lanes[0].tasks[0]._id,
          data.withTasks.lanes[1],
          0
        ),
        {
          lanes: [
            {
              ...data.withTasks.lanes[0],
              tasks: data.withTasks.lanes[0].tasks.slice(1),
            },
            {
              ...data.withTasks.lanes[1],
              tasks: [
                data.withTasks.lanes[0].tasks[0],
                ...data.withTasks.lanes[1].tasks,
              ],
            },
            data.withTasks.lanes[2],
          ],
        }
      );
    },
  },
};

for (const [description, tests] of Object.entries(suite)) {
  console.log(`\n${description}`);
  for (const [title, test] of Object.entries(tests)) {
    try {
      test();
      console.log(`✅ ${title}`);
    } catch (error) {
      console.error(`❌ ${title}`);
      console.error(error.message);
    }
  }
}
