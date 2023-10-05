/** @typedef {import('./types').Board} Board */
/** @typedef {import('./types').Lane} Lane */
/** @typedef {import('./types').Task} Task */

export default {
  // Only used for type checking
  /** @type {string} */ _id: '',
  /** @type {Lane[]} */ lanes: [],

  // Board
  set(/** @type {Partial<Board>} */ board) {
    return board;
  },

  // Lanes
  addLane() {
    return {
      lanes: [...this.lanes, { name: 'New Lane', tasks: [] }],
    };
  },

  removeLane(/** @type {Lane} */ lane) {
    return {
      lanes: remove(this.lanes, lane),
    };
  },

  updateLane(/** @type {Lane} */ lane, /** @type {string} */ name) {
    return {
      lanes: this.lanes.map((l) => (l === lane ? { ...l, name } : l)),
    };
  },

  moveLane(/** @type {string} */ laneId, /** @type {number} */ toIndex) {
    const fromIndex = this.lanes.findIndex((lane) => lane._id === laneId);
    const lane = this.lanes[fromIndex];

    return {
      lanes: insert(
        remove(this.lanes, lane),
        lane,
        fromIndex < toIndex ? toIndex - 1 : toIndex
      ),
    };
  },

  // Tasks
  addTask(/** @type {Lane} */ lane, /** @type {string} */ text) {
    return text
      ? {
          lanes: this.lanes.map((l) =>
            l === lane ? { ...l, tasks: [{ text }, ...l.tasks] } : l
          ),
        }
      : {};
  },

  updateTask(/** @type {Task} */ task, /** @type {string} */ text) {
    return {
      lanes: this.lanes.map((lane) => ({
        ...lane,
        tasks: text
          ? lane.tasks.map((t) => (t === task ? { ...task, text } : t))
          : remove(lane.tasks, task),
      })),
    };
  },

  moveTask(
    /** @type {string} */ taskId,
    /** @type {Lane} */ toLane,
    /** @type {number} */ toIndex
  ) {
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

const byId = (/** @type {any} */ id) => (/** @type {{ _id: any }} */ object) =>
  object._id === id;

/** @type {<T>(array: T[], item: T) => T[]} */
const remove = (array, item) => array.filter(notEqual(item));

/** @type {<T>(array: T[], item: T, index: number) => T[]} */
const insert = (array, item, index) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];
