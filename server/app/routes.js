const constants = require('./constants');
const db = require('./db');
const Page = require('./layouts/Page');
const App = require('./pages/App');
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
      const updatedBoard = await db.updateBoard(request.params.boardId, data);
      return response.html(await App({ board: updatedBoard, constants }));
    },
  },

  // Lanes
  '/boards/:boardId/lanes': {
    async post(request, response) {
      const updatedBoard = await db.addLane(request.params.boardId);
      return response.html(await App({ board: updatedBoard, constants }));
    },
  },

  '/boards/:boardId/lanes/:laneId': {
    async delete(request, response) {
      const updatedBoard = await db.deleteLane(
        request.params.boardId,
        request.params.laneId
      );
      return response.html(await App({ board: updatedBoard, constants }));
    },
  },

  // Tasks
};
