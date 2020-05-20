const { Sequelize } = require("sequelize");
//const { DATABASE, DB_USERNAME, DB_PASSWORD, HOST, DIALECT } = require("./config.json").development;

const sequelize = new Sequelize({
	host: "localhost",
	port: 3306,
	database: "testing",
	username: "root",
	password: "root",
	dialect: "mysql",
});

module.exports = sequelize;