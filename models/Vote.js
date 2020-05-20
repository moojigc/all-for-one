module.exports = function (sequelize, DataTypes) {
	const Vote = sequelize.define("Vote", {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		lastVoteWas: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	Vote.associate = (models) => {
		// Add foreign key for Users
		Vote.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			},
			onDelete: "CASCADE"
		});
		// Foreign key for top-level comments
		Vote.belongsTo(models.Comment, {
			foreignKey: {
				allowNull: true,
				defaultValue: null
			},
			onDelete: "CASCADE"
		});
		// Foreign key for Subcomments
		Vote.belongsTo(models.Subcomment, {
			foreignKey: {
				allowNull: true,
				defaultValue: null
			},
			onDelete: "CASCADE"
		});
		// Foreign key for Posts
		Vote.belongsTo(models.Post, {
			foreignKey: {
				allowNull: true,
				defaultValue: null
			},
			onDelete: "CASCADE"
		});
		models.Post.hasMany(Vote);
		models.Comment.hasMany(Vote);
		models.Subcomment.hasMany(Vote);
		models.User.hasMany(Vote);
	};

	return Vote;
};
