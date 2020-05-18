module.exports = function(sequelize, DataTypes) {
	const Comment = sequelize.define("Comment",
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
		}
	);

	Comment.associate = models => {
		// Add foreign key for Users
		Comment.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
		Comment.belongsTo(models.Post, {
			foreignKey: {
				allowNull: false
			}
		});
		models.Post.hasMany(Comment);
		models.User.hasMany(Comment);
	};

	return Comment;
};