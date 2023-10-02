const constants = require('./constants');
const db = require('./db');
const Page = require('./layouts/Page');
const pages = require('./pages');
const utils = require('./utils');

module.exports = {
  // Boards
  '/boards/:boardId': {
    async get(request, response) {
      const board = await db.getBoard(request.params.boardId);
      return response.html(
        await Page({ body: await pages.App({ board, constants }) })
      );
    },

    async put(request, response) {
      const data = utils.parseFormData(request.body);
      const board = await db.updateBoard(request.params.boardId, data);
      return response.html(await pages.App({ board, constants }));
    },
  },

  // Lanes
  '/boards/:boardId/lanes': {
    async post(request, response) {
      await db.createLane(request.params.boardId);
      return response.html(
        await pages.Lane({
          board: { _id: request.params.boardId },
          lane: constants.NEW_LANE,
        })
      );
    },
  },

  '/boards/:boardId/lanes/:laneId': {
    async delete(request, response) {
      await db.deleteLane(request.params.boardId, request.params.laneId);
      return response.noContent();
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
        await pages.Task({ lane: { _id: request.params.laneId }, task })
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
        await pages.Task({ lane: { _id: request.params.laneId }, task })
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
