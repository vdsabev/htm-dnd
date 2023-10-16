const path = require('path');
const ejs = require('ejs');

const db = require('./db');
const utils = require('./utils');

module.exports = {
  // Boards
  '/boards/:boardId': {
    async get(request, response) {
      const board = await db.getBoard(request.params.boardId);
      return response.html(
        await ejs.renderFile(
          path.normalize(
            process.env.NODE_ENV === 'development'
              ? `${__dirname}/index.html`
              : `${__dirname}/../index.html`
          ),
          { board }
        )
      );
    },

    async patch(request, response) {
      const data = utils.parseJSONData(request.body);
      const board = await db.updateBoard(request.params.boardId, data);
      return response.json(board);
    },
  },
};
