module.exports = function (sequelize, DataTypes) {
	const Subcomment = sequelize.define("Subcomment", {
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
	});
	Subcomment.associate = (models) => {
		// Add foreign key for Users
		Subcomment.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			},
			onDelete: "CASCADE"
		});
		// Foreign key for top-level comments
		Subcomment.belongsTo(models.Comment, {
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
		models.Comment.hasMany(Subcomment);
		Subcomment.hasMany(Subcomment);
		models.User.hasMany(Subcomment);
	};

	return Subcomment;
};
