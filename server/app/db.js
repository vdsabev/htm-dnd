const mongoose = require('mongoose');
const constants = require('./constants');

/** @type {mongoose} */
let connection = null;

const connect = async function () {
  if (connection) return connection;

  // Assign first, await later to avoid multiple function calls creating new connections
  connection = mongoose.connect(process.env.MONGO_DB_URL, {
    serverSelectionTimeoutMS: 5000,
  });

  await connection;

  mongoose.model(
    'board',
    new mongoose.Schema({
      lanes: [{ name: String, tasks: [{ text: String }] }],
    })
  );

  return connection;
};

module.exports = {
  // Board
  async getBoard(/** @type {string} */ boardId) {
    const db = await connect();
    // TODO: Create a new board if the ID doesn't exist
    return db.model('board').findById(boardId).lean();
  },

  async updateBoard(/** @type {string} */ boardId, data) {
    const db = await connect();
    return db
      .model('board')
      .findOneAndUpdate({ _id: boardId }, data, { new: true })
      .lean();
  },

  // Lane
  async addLane(/** @type {string} */ boardId) {
    const db = await connect();
    return db
      .model('board')
      .findOneAndUpdate(
        { _id: boardId },
        { $push: { lanes: constants.NEW_LANE } },
        { new: true }
      )
      .lean();
  },

  async deleteLane(
    /** @type {string} */ boardId,
    /** @type {string} */ laneId
  ) {
    const db = await connect();
    return db
      .model('board')
      .findOneAndUpdate(
        { _id: boardId },
        { $pull: { lanes: { _id: laneId } } },
        { new: true }
      )
      .lean();
  },

  // Task
  async updateTask(
    /** @type {string} */ boardId,
    /** @type {string} */ laneId,
    /** @type {string} */ taskId,
    /** @type {string} */ text
  ) {
    const db = await connect();
    return db
      .model('board')
      .findOneAndUpdate(
        { _id: boardId, 'lanes._id': laneId, 'lanes.tasks._id': taskId },
        { $set: { 'lanes.$.tasks.$.text': text } },
        { new: true }
      )
      .lean();
  },
};
