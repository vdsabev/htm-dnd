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
    'data',
    new mongoose.Schema({
      lanes: [{ name: String, tasks: [String] }],
    })
  );

  return connection;
};

module.exports = {
  async getDataForId(/** @type {string} */ dataId) {
    const db = await connect();
    return db.model('data').findById(dataId).lean();
  },
  async setDataForId(/** @type {string} */ dataId, newData) {
    const db = await connect();
    return db
      .model('data')
      .findOneAndUpdate({ _id: dataId }, newData, { new: true })
      .lean();
  },
  async addNewLane(/** @type {string} */ dataId) {
    const db = await connect();
    return db
      .model('data')
      .findOneAndUpdate(
        { _id: dataId },
        { $push: { lanes: constants.NEW_LANE } },
        { new: true }
      )
      .lean();
  },
  async deleteLane(/** @type {string} */ dataId, /** @type {string} */ laneId) {
    const db = await connect();
    return db
      .model('data')
      .findOneAndUpdate(
        { _id: dataId },
        { $pull: { lanes: { _id: laneId } } },
        { new: true }
      )
      .lean();
  },
};
