import { html, render } from 'html';
import { createStore } from 'overstate';

import Board from './components/Board.js';
import http from './http.js';

const store = createStore({
  ...window.app.board,

  set(model) {
    return model;
  },

  // Lanes
  addLane() {
    return {
      lanes: [...this.lanes, { name: 'New Lane', tasks: [] }],
    };
  },

  removeLane(lane) {
    return {
      lanes: this.lanes.filter((l) => l !== lane),
    };
  },

  // Tasks
  moveTask(taskId, toLane, toIndex) {
    const fromLane = this.lanes.find((lane) =>
      lane.tasks.find((task) => task._id === taskId)
    );
    const fromIndex = fromLane.tasks.findIndex(
      (task) => task._id === taskId
    );
    const task = fromLane.tasks[fromIndex];

    return {
      lanes: this.lanes
        .map((lane) =>
          lane._id === fromLane._id
            ? {
                ...lane,
                tasks: [
                  ...lane.tasks.slice(0, fromIndex),
                  ...lane.tasks.slice(fromIndex + 1),
                ],
              }
            : lane
        )
        .map((lane) =>
          lane === toLane
            ? {
                ...lane,
                tasks: [
                  ...lane.tasks.slice(0, toIndex),
                  task,
                  ...lane.tasks.slice(toIndex),
                ],
              }
            : lane
        ),
    };
  },
});

const mount = (board) =>
  render(html`<${Board} board=${board} />`, document.querySelector('main'));
mount(store.model);

store.subscribe(mount);

/** @type {number | undefined} */ let httpTimer;
let lastStoredData = JSON.stringify(store.model);
store.subscribe((board) => {
  window.clearTimeout(httpTimer);
  httpTimer = setTimeout(() => {
    const body = JSON.stringify(board);
    if (lastStoredData === body) return;

    http
      .patch(`/boards/${board._id}`, { body })
      .then((data) => {
        lastStoredData = JSON.stringify(data);
        store.set(data);
      })
      .catch((error) => {
        window.alert(error.toString());
      });
  }, 300);
});
