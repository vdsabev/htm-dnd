export default {
  // Board
  set(board) {
    return board;
  },

  // Lanes
  addLane() {
    return {
      lanes: [...this.lanes, { name: 'New Lane', tasks: [] }],
    };
  },

  removeLane(lane) {
    return {
      lanes: remove(this.lanes, lane),
    };
  },

  updateLane(lane, /** @type {string} */ name) {
    return {
      lanes: this.lanes.map((l) => (l === lane ? { ...l, name } : l)),
    };
  },

  // Tasks
  addTask(lane, /** @type {string} */ text) {
    return text
      ? {
          lanes: this.lanes.map((l) =>
            l === lane ? { ...l, tasks: [{ text }, ...l.tasks] } : l
          ),
        }
      : {};
  },

  updateTask(task, /** @type {string} */ text) {
    return {
      lanes: this.lanes.map((lane) => ({
        ...lane,
        tasks: text
          ? lane.tasks.map((t) => (t === task ? { ...task, text } : t))
          : remove(lane.tasks, task),
      })),
    };
  },

  moveTask(taskId, toLane, toIndex) {
    const fromLane = this.lanes.find((lane) => lane.tasks.find(byId(taskId)));
    const fromIndex = fromLane.tasks.findIndex(byId(taskId));

    const task = fromLane.tasks[fromIndex];

    return {
      lanes: this.lanes
        .map((lane) =>
          lane._id === fromLane._id
            ? { ...lane, tasks: remove(lane.tasks, task) }
            : lane
        )
        .map((lane) =>
          lane._id === toLane._id
            ? {
                ...lane,
                tasks: insert(
                  lane.tasks,
                  task,
                  fromLane._id === toLane._id && fromIndex < toIndex
                    ? toIndex - 1
                    : toIndex
                ),
              }
            : lane
        ),
    };
  },
};

// Utils
const notEqual = (item1) => (item2) => item1 !== item2;
const byId = (id) => (object) => object._id === id;
const remove = (array, item) => array.filter(notEqual(item));
const insert = (array, item, index) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];
