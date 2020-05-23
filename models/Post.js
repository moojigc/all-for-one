module.exports = function (sequelize, DataTypes) {
	const Post = sequelize.define("Post",
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [1]
				}
			},
			body: {
				type: DataTypes.TEXT,
				allowNull: false,
				len: [1, 40000]
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
				defaultValue: 1,
				validate: {
					min: 0
				}
			},
			downvotes: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0
				}
			},
			// The app's whole idea is to be based on location, so we need latitude and longitute
			lat: {
				type: DataTypes.DECIMAL(12, 9),
				allowNull: false,
				// Default value is going to be Null Island 😎
				defaultValue: 0.0,
				validate: {
					isDecimal: true
				}
			},
			long: {
				type: DataTypes.DECIMAL(12, 9),
				allowNull: false,
				defaultValue: 0.0,
				validate: {
					isDecimal: true
				}
			},
			city: {
				type: DataTypes.STRING,
				allowNull: true
			},
			state: {
				type: DataTypes.STRING,
				allowNull: true
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true
			},
			deleteHash: {
				type: DataTypes.STRING,
				allowNull: true
			}
		}
	);
	Post.associate = models => {
		// Add foreign key for Users
		Post.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			},
			onDelete: "cascade"
		});
		models.User.hasMany(Post);
	};

	return Post;
};
