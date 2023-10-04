const mongoose = require('mongoose');

/** @type {Promise<typeof mongoose>} */
let connection = null;

const Task = new mongoose.Schema({ text: String });
const Lane = new mongoose.Schema({ name: String, tasks: [Task] });
const Board = new mongoose.Schema({ lanes: [Lane] });

const connect = async function () {
  if (connection) return connection;

  // Assign first, await later to avoid multiple function calls creating new connections
  connection = mongoose.connect(process.env.MONGO_DB_URL, {
    serverSelectionTimeoutMS: 5000,
  });

  await connection;

  mongoose.model('board', Board);

  return connection;
};

module.exports = {
  // Board
  async getBoard(/** @type {string} */ boardId) {
    const db = await connect();
    return db.model('board').findById(boardId).lean();
  },

  async updateBoard(/** @type {string} */ boardId, data) {
    const db = await connect();
    return db
      .model('board')
      .findOneAndUpdate({ _id: boardId }, data, { new: true })
      .lean();
  },
};
