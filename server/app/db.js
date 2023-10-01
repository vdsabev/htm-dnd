const mongoose = require('mongoose');

/** @type {mongoose} */
let connection = null;

const connect = async function () {
  if (!connection) {
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
  }
};

module.exports = {
  async getDataForId(/** @type {string} */ id) {
    const db = await connect();
    return db.model('data').findById(id).lean();
  },
  async setDataForId(/** @type {string} */ id, data) {
    const db = await connect();
    return db.model('data').updateOne({ _id: id }, data);
  },
};
