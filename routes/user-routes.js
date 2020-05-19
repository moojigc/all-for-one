// Requiring our models and passport as we've configured it
const passport = require("../config/passport"),
	{ User } = require("../models");
module.exports = function (app) {
	// Login
	app.post("/users/login", passport.authenticate("local"), function (req, res) {
		// Redirect to homepage
		res.redirect("/");
	});

	// Registration
	app.post("/users/register", async (req, res) => {
		try {
			await User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
				password: req.body.password,
				birthdate: req.body.birthdate,
				avatar: req.body.avatar,
				lat: req.body.lat,
				long: req.body.long
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
		req.flash("successMsg", "You are logged out.");
		res.redirect("/users/login");
	});

	// Route for getting some data about our user to be used client side
	app.get("/api/user_data", (req, res) => {
		if (!req.user) {
			// If not logged in
			res.json({
				message: "Unauthorized."
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
