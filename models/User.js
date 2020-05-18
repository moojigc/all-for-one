const bcrypt = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define("User",
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					// Can't be empty str, or longer than 50 char
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
					len: [3]
				}
			},
			// The password cannot be null
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [8]
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
			// Allow for user pictures
			avatar: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: "https://vignette.wikia.nocookie.net/animalcrossing/images/d/d8/Nook-phone-char-2-2x.png/revision/latest/top-crop/width/360/height/360?cb=20200504020339",
				validate: {
					isUrl: true
				}
			},
			birthdate: {
				// YYYY-MM-DD
				type: DataTypes.DATEONLY,
				allowNull: true,
				validate: {
					isDate: true
				}
			},
			// User's score from upvotes on their posts
			postUpvotes: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0
				}
			},
			postDownvotes: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0
				}
			},
			// User's score from upvotes on their comments
			commentUpvotes: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0
				}
			},
			commentDownvotes: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0
				}
			}
		}
	);

	// Hooks are automatic methods that run during various phases of the User Model lifecycle
	// In this case, before a User is created, we will automatically hash their password
	User.addHook("beforeCreate", function (user) {
		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
	});
	return User;
};