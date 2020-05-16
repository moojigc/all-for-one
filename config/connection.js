const { Sequelize } = require("sequelize");
const { DATABASE, DB_USERNAME, DB_PASSWORD, HOST, DIALECT } = require("./config.json").development;

const sequelize = new Sequelize({
	host: HOST,
	database: DATABASE,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	dialect: DIALECT
});

module.exports = sequelize;

