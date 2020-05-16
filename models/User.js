const bcrypt = require("bcryptjs");
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");

class User extends Model {}
User.init(
	{
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [4]
			}
		},
		// The password cannot be null
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ sequelize, modelName: "User" }
);

// Hooks are automatic methods that run during various phases of the User Model lifecycle
// In this case, before a User is created, we will automatically hash their password
User.addHook("beforeCreate", function (user) {
	user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
});

module.exports = User;
