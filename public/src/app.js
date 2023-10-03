import { html, render } from 'html';
import { createStore } from 'overstate';

import Board from './components/Board.js';
import http from './http.js';

const store = createStore({
  ...window.app.data,

  set(model) {
    return model;
  },

  // Lanes
  addLane() {
    const newLane = { ...this.newLane };
    const changes = {
      lanes: [...this.lanes, newLane],
    };

    http
      .post(`/boards/${this._id}/lanes`)
      .then((lane) => {
        this.replaceLane(newLane, lane);
      })
      .catch((error) => {
        // TODO: Error handling
        this.removeLaneClient(newLane);
      });

    return changes;
  },

  replaceLane(oldLane, newLane) {
    return {
      lanes: this.lanes.map((l) => (l === oldLane ? newLane : l)),
    };
  },

  removeLane(lane) {
    if (lane._id) {
      const index = this.lanes.indexOf(lane);
      http.delete(`/boards/${this._id}/lanes/${lane._id}`).catch((error) => {
        // TODO: Error handling
        this.set({
          lanes: [
            ...this.lanes.slice(0, index),
            lane,
            ...this.lanes.slice(index),
          ],
        });
      });
    }

    return this.removeLaneClient(lane);
  },

  removeLaneClient(lane) {
    return {
      lanes: this.lanes.filter((l) => l !== lane),
    };
  },

  // Tasks
  moveTask(taskId, laneId, index) {
    const oldLane = this.lanes.find((lane) =>
      lane.tasks.find((task) => task._id === taskId)
    );
    const taskIndex = oldLane.tasks.findIndex((task) => task._id === taskId);
    const task = oldLane.tasks[taskIndex];

    return {
      lanes: this.lanes
        .map((lane) =>
          lane._id === oldLane._id
            ? {
                ...lane,
                tasks: [
                  ...lane.tasks.slice(0, taskIndex),
                  ...lane.tasks.slice(taskIndex + 1),
                ],
              }
            : lane
        )
        .map((lane) =>
          lane._id === laneId
            ? {
                ...lane,
                tasks: [
                  ...lane.tasks.slice(0, index),
                  task,
                  ...lane.tasks.slice(index),
                ],
              }
            : lane
        ),
    };
  },
});

const mount = (model) =>
  render(html`<${Board} board=${model} />`, document.querySelector('main'));
mount(store.model);

store.subscribe(mount);
