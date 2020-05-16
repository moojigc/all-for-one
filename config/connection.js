const { Sequelize } = require("sequelize");
// Using ternary operator to auto switch to env vars in deployment
const { DATABASE, DB_USERNAME, DB_PASSWORD, HOST, DIALECT } = process.env.PORT ? process.env : require("./config.json").development;

const sequelize = new Sequelize({
	host: HOST,
	database: DATABASE,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	dialect: DIALECT
});

module.exports = sequelize;