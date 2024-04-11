const Sequelize = require("sequelize");

/** @type {Sequelize} */
const sequelize = new Sequelize("node-complete", "root", "D130319900k!", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
