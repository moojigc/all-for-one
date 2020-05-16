const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");

class Post extends Model { }
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