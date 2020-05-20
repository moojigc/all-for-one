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
	app.post("/api/users", async (req, res) => {
		if (req.body.password !== req.body.password2) {
			req.flash("errorMsg", "Passwords must match!");
			res.json({ redirectURL: "/users/register" }).end();
		} else if (!req.body.username) {
			req.flash("errorMsg", "Username is required!");
			res.json({ redirectURL: "/users/register" }).end();
		} else {
			try {
				// Need the ternary operators bc Sequelize and MySQL interpret empty strings, undefined, and null differently
				await User.create({
					firstName: req.body.firstName ? req.body.firstName : null,
					lastName: req.body.lastName ? req.body.lastName : null,
					username: req.body.username,
					password: req.body.password,
					birthdate: req.body.birthdate ? req.body.birthdate : undefined,
					avatar: req.body.avatar ? req.body.avatar : undefined,
					lat: req.body.lat ? req.body.lat : undefined,
					long: req.body.long ? req.body.long : undefined
				});
				req.flash("successMsg", "Successfully created account. Now, please login.")
				res.json({ redirectURL: "/users/login" });
			} catch (error) {
				console.log(error);
				res.json({ redirectURL: "/server_error" }).end();
			}
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
