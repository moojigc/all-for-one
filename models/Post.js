const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");

class Post extends Model {}
Post.init(
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
			len: [1],
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: true,
			validate: {
				isUrl: true
			}
		},
		upvotes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		downvotes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
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
	{ sequelize, modelName: "Post" }
);

// Add foreign key for Users
Post.belongsTo(User, {
	foreignKey: {
		allowNull: false,
	},
});

Post.sync();

module.exports = Post;
