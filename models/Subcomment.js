const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/connection");
const Comment = require("./Comment");
const User = require("./User");

class Subcomment extends Model {}

Subcomment.init(
	{
		body: {
			type: DataTypes.TEXT,
			allowNull: false,
			len: [1, 10000]
		},
		upvotes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		downvotes: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	},
	{ sequelize, modelName: "Subcomment" }
);

// Add foreign key for Users
Subcomment.belongsTo(User, {
	foreignKey: {
		allowNull: false
	},
	onDelete: "CASCADE"
});
// Foreign key for top-level comments
Subcomment.belongsTo(Comment, {
	foreignKey: {
		allowNull: true,
		defaultValue: null
	},
	onDelete: "CASCADE"
});
// Foreign key for other subcomments
Subcomment.belongsTo(Subcomment, {
	foreignKey: {
		allowNull: true,
		defaultValue: null
	},
	onDelete: "CASCADE"
});
Comment.hasMany(Subcomment);
Subcomment.hasMany(Subcomment);
User.hasMany(Subcomment);

Subcomment.sync();

module.exports = Subcomment;
