export default {
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

  updateLane(lane, name) {
    return {
      lanes: this.lanes.map((l) => (l === lane ? { ...l, name } : l)),
    };
  },

  // Tasks
  addTask(lane, text) {
    return text
      ? {
          lanes: this.lanes.map((l) =>
            l === lane ? { ...l, tasks: [{ text }, ...l.tasks] } : l
          ),
        }
      : {};
  },

  updateTask(task, text) {
    return {
      lanes: this.lanes.map((lane) => ({
        ...lane,
        tasks: text
          ? lane.tasks.map((t) => (t === task ? { ...task, text } : t))
          : remove(lane.tasks, task),
      })),
    };
  },

  // TODO: Fix disappearing task when moving it after itself
  moveTask(taskId, toLane, toIndex) {
    const fromLane = this.lanes.find((lane) => lane.tasks.find(byId(taskId)));
    const task = fromLane.tasks.find(byId(taskId));

    return {
      lanes: this.lanes
        .map((lane) =>
          lane === fromLane
            ? { ...lane, tasks: remove(lane.tasks, task) }
            : lane
        )
        .map((lane) =>
          lane === toLane
            ? { ...lane, tasks: insert(lane.tasks, task, toIndex) }
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
