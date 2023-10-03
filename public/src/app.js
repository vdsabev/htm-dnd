import { html, render } from 'html';
import { createStore } from 'overstate';

import Board from './components/Board.js';
import http from './http.js';

// Store
const store = createStore({
  ...window.app.board,

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

  // Tasks
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
});

// Utils
const notEqual = (item1) => (item2) => item1 !== item2;
const byId = (id) => (object) => object._id === id;
const remove = (array, item) => array.filter(notEqual(item));
const insert = (array, item, index) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index),
];

// Render app
const mount = (board) =>
  render(html`<${Board} board=${board} />`, document.querySelector('main'));
mount(store.model);

store.subscribe(mount);

// Save data
/** @type {number | undefined} */ let httpTimer;
let lastSavedData = JSON.stringify(store.model);
store.subscribe((board) => {
  window.clearTimeout(httpTimer);
  httpTimer = setTimeout(() => {
    const body = JSON.stringify(board);
    if (lastSavedData === body) return; // No need to save data

    http
      .patch(`/boards/${board._id}`, { body })
      .then((data) => {
        lastSavedData = JSON.stringify(data);
        store.set(data);
      })
      .catch((error) => {
        window.alert(error.toString());
      });
  }, 300);
});
