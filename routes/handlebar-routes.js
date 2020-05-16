const isAuthenticated = require("../config/middleware/isAuthenticated");
const User = require("../models/User");

module.exports = function (app) {
	// Displays the homepage
	app.get("/", (req, res) => {
		if (!req.user) {
			let emptyUser = {
				username: 'Guest'
			};
			res.render("index", { user: emptyUser });
		} else {
			res.render("index", { user: req.user });
		}
	});
	// Login
	app.get("/users/login", (req, res) => {
		res.render("login", {});
	});
	// Register
	app.get("/users/register", (req, res) => {
		res.render("register", {});
	});
	// User info page
	app.get("/users/info", isAuthenticated, async (req, res) => {
		let user = await User.findOne({
			where: {
				username: req.user.username
			}
		});
		// res.render("user-info", { user: user })
		res.json(user).end();
	});
};
