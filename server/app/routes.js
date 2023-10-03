const ejs = require('ejs');

const constants = require('./constants');
const db = require('./db');
const utils = require('./utils');

module.exports = {
  // Boards
  '/boards/:boardId': {
    async get(request, response) {
      const board = await db.getBoard(request.params.boardId);
      return response.html(
        await ejs.renderFile(`${__dirname}/index.html`, { board, constants })
      );
    },

    async put(request, response) {
      const data = utils.parseJSONData(request.body);
      const board = await db.updateBoard(request.params.boardId, data);
      return response.json(board);
    },
  },

  // Lanes
  '/boards/:boardId/lanes': {
    async post(request, response) {
      const lane = await db.createLane(request.params.boardId);
      return response.json(lane);
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
      return response.json(task);
    },
  },

  '/boards/:boardId/lanes/:laneId/tasks/:taskId': {
    async patch(request, response) {
      const task = await db.updateTask(
        request.params.boardId,
        request.params.laneId,
        request.params.taskId,
        request.body
      );
      return response.json(task);
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
