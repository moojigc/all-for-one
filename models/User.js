const bcrypt = require("bcryptjs");
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");

class User extends Model {}
User.init(
	{
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 50]
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: [1, 50]
			}
		},
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
		},
		// The app's whole idea is to be based on location, so we need latitude and longitute
		lat: {
			type: DataTypes.DECIMAL(12, 9),
			allowNull: false,
			// Default value is going to be Stamford, CT
			defaultValue: 41.0534,
			validate: {
				isDecimal: true
			}
		},
		long: {
			type: DataTypes.DECIMAL(12, 9),
			allowNull: false,
			defaultValue: 73.5387,
			validate: {
				isDecimal: true
			}
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
