const mongoose = require('mongoose');
const constants = require('./constants');

/** @type {mongoose} */
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
  async createLane(/** @type {string} */ boardId) {
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
  async createTask(
    /** @type {string} */ boardId,
    /** @type {string} */ laneId,
    /** @type {string} */ text
  ) {
    const db = await connect();
    const task = { _id: mongoose.Types.ObjectId(), text };

    await db
      .model('board')
      .updateOne({ _id: boardId, 'lanes._id': laneId }, { $push: task })
      .lean();

    return task;
  },

  async updateTask(
    /** @type {string} */ boardId,
    /** @type {string} */ laneId,
    /** @type {string} */ taskId,
    /** @type {string} */ text
  ) {
    const db = await connect();
    await db
      .model('board')
      .updateOne(
        { _id: boardId },
        { $set: { 'lanes.$[lane].tasks.$[task].text': text } },
        { arrayFilters: [{ 'lane._id': laneId }, { 'task._id': taskId }] }
      )
      .lean();

    return { _id: taskId, text };
  },

  async deleteTask(
    /** @type {string} */ boardId,
    /** @type {string} */ laneId,
    /** @type {string} */ taskId
  ) {
    const db = await connect();
    await db
      .model('board')
      .updateOne(
        { _id: boardId, 'lanes._id': laneId },
        { $pull: { 'lanes.$.tasks': { _id: taskId } } }
      )
      .lean();
  },
};
