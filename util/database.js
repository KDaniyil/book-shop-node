// const { Sequelize } = require("sequelize");

// /** @type {Sequelize} */
// const sequelize = new Sequelize("node-complete", "root", "D130319900k!", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://Dani:D130319900k!@cluster0.rtvebxo.mongodb.net/shop";
let _db;
const mongoConnection = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected to database");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found");
};

module.exports = {
  mongoConnection,
  getDb,
};
