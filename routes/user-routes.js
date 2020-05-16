// Requiring our models and passport as we've configured it
const User = require('../models/User');
const passport = require("../config/passport");

module.exports = function(app) {
	// Login
	app.post("/users/login", passport.authenticate("local"), function (req, res) {
		// Redirect to homepage
		res.redirect('/users/info');
	});

	// Registration
	app.post("/users/register", async (req, res) => {
		try {
			await User.create({
				username: req.body.username,
				password: req.body.password
			});
			res.redirect(307, "/users/login");
		} catch (error) {
			console.log(error);
			res.status(401).json(error);
		}
	});

	// Route for logging user out
	app.get("/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	// Route for getting some data about our user to be used client side
	app.get("/api/user_data", (req, res) => {
		if (!req.user) {
			// If not logged in
			res.json({
				message: 'Unauthorized.'
			});
		} else {
			// Logged in
			res.json({
				email: req.user.email,
				id: req.user.id
			});
		}
	});
};