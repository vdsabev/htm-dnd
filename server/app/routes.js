const constants = require('./constants');
const db = require('./db');
const Page = require('./layouts/Page');
const { App, Task } = require('./pages');
const utils = require('./utils');

module.exports = {
  // Boards
  '/boards/:boardId': {
    async get(request, response) {
      const board = await db.getBoard(request.params.boardId);
      return response.html(
        await Page({ body: await App({ board, constants }) })
      );
    },

    async put(request, response) {
      const data = utils.parseFormData(request.body);
      const board = await db.updateBoard(request.params.boardId, data);
      return response.html(await App({ board, constants }));
    },
  },

  // Lanes
  // TODO: Only update lane, not the whole page
  '/boards/:boardId/lanes': {
    async post(request, response) {
      const board = await db.createLane(request.params.boardId);
      return response.html(await App({ board, constants }));
    },
  },

  // TODO: Only remove lane, don't update the whole page
  '/boards/:boardId/lanes/:laneId': {
    async delete(request, response) {
      const board = await db.deleteLane(
        request.params.boardId,
        request.params.laneId
      );
      return response.html(await App({ board, constants }));
    },
  },

  // Tasks
  '/boards/:boardId/lanes/:laneId/tasks': {
    async post(request, response) {
      const task = await db.createTask(
        request.params.boardId,
        request.params.laneId,
        request.body
      );
      return response.html(
        await Task({
          board: { _id: request.params.boardId },
          lane: { _id: request.params.laneId },
          task,
        })
      );
    },
  },

  '/boards/:boardId/lanes/:laneId/tasks/:taskId': {
    async put(request, response) {
      const task = await db.updateTask(
        request.params.boardId,
        request.params.laneId,
        request.params.taskId,
        request.body
      );
      return response.html(
        await Task({
          board: { _id: request.params.boardId },
          lane: { _id: request.params.laneId },
          task,
        })
      );
    },

    async delete(request, response) {
      await db.deleteTask(
        request.params.boardId,
        request.params.laneId,
        request.params.taskId
      );
      return response.noContent();
    },
  },
};
