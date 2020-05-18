const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");
const Post = require("./Post");

class Comment extends Model {}

Comment.init(
	{
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
			len: [1, 10000]
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
		}
	},
	{ sequelize, modelName: "Comment" }
);

// Add foreign key for Users
Comment.belongsTo(User, {
	foreignKey: {
		allowNull: false
	}
});
Comment.belongsTo(Post, {
	foreignKey: {
		allowNull: false
	}
});
Post.hasMany(Comment);
User.hasMany(Comment);

Comment.sync();

module.exports = Comment;
