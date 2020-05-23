// Requiring our models and passport as we've configured it
const passport = require("../config/passport"),
	{ User } = require("../models"),
	bcrypt = require("bcryptjs"),
	{ reverseLocation, forwardLocation } = require("../config/middleware/openGeo");

module.exports = function (app) {
	// Login
	app.post(
		"/users/login",
		passport.authenticate("local", {
			successRedirect: "/",
			failureRedirect: "/users/login",
			failureFlash: true
		}), (req, res) => {
			// Redirect to homepage
			res.redirect("/");
		}
	);

	// Registration
	app.post("/api/users", async (req, res) => {
		if (req.body.password !== req.body.password2) {
			req.flash("errorMsg", "Passwords must match!");
			res.json({ redirectURL: "/users/register" }).end();
		} else if (req.body.password.split('').length < 8) {
			req.flash("errorMsg", "Password too short! Must be at least 8 characters.");
			res.json({ redirectURL: "/users/register" }).end();
		} else if (!req.body.username) {
			req.flash("errorMsg", "Username is required!");
			res.json({ redirectURL: "/users/register" }).end();
		} else if (!req.body.country && !req.body.lat) {
			req.flash("errorMsg", "Country is required.");
			res.json({ redirectURL: "/users/register" }).end();
		} else {
			try {
				// If the user does not allow browser location data but does input their info manually
				async function getLocationData() {
					if (!req.body.lat || !req.body.long) {
						return await forwardLocation({
							city: req.body.city,
							state: req.body.state,
							country: req.body.country
						});
					} else {
						return await reverseLocation(req.body.lat, req.body.long);
					}
				}
				let location = (await getLocationData()).data.results[0];
				let city = location.components.city ? location.components.city : location.components.town;
				let state = location.components.state;
				let country = location.components.country_code;
				let { lat, lng } = location.geometry;
				await User.create({
					// Need the ternary operators bc Sequelize and MySQL interpret empty strings, undefined, and null differently
					firstName: req.body.firstName ? req.body.firstName : null,
					lastName: req.body.lastName ? req.body.lastName : null,
					username: req.body.username,
					password: req.body.password,
					birthdate: req.body.birthdate ? req.body.birthdate : undefined,
					avatar: req.body.avatar ? req.body.avatar : undefined,
					// Either the browser location or the openGeo location
					lat: lat,
					long: lng,
					city: city,
					state: state,
					country: country
				});
				req.flash("successMsg", "Successfully created account. Please login with your new credentials.");
				res.json({ redirectURL: "/users/login" });
			} catch (error) {
				console.log(error);
				res.json({ redirectURL: "/server-error" }).end();
			}
		}
	});

	// Route for logging user out
	app.get("/users/logout", (req, res) => {
		req.logout();
		req.flash("successMsg", "You are logged out.");
		res.redirect("/users/login");
	});

	// Get user profile page
	app.get("/my-profile", async (req, res) => {
		if (!req.user) {
			// If not logged in
			req.flash("errorMsg", "Must be logged in to view this resource.");
			res.redirect("/users/login");
		} else {
			// Logged in
			let user = (
				await User.findOne({
					where: {
						id: req.user
					}
				})
			).dataValues;
			delete user.password;
			let location = await reverseLocation(user.lat, user.long);
			let { state, town, country } = location.data.results[0].components;
			// console.log(location.data.results);
			console.log(town, state, country);
			user.state = state ? state : null;
			user.city = town ? town : null;
			user.country = country ? country : null;
			res.render("view-profile", {
				user: user
			});
		}
	});
	// Route for deleting a user
	app.delete("/api/users", async (req, res) => {
		if (!req.user) return res.status(401).json({ message: "You are not authorized to do that.", status: 401 });
		else {
			let response = await User.destroy({
				where: {
					id: req.user
				}
			});
			console.log(response);
			res.json(response).end();
		}
	});
	app.put("/api/users/:category", async (req, res) => {
		if (!req.user) return res.status(401).json({ message: "You are not authorized to do that.", status: 401 });
		else {
			let update = {};
			switch (req.params.category) {
				case "avatar":
					update = {
						avatar: req.params.avatar
					};
					break;
				case "firstName":
					update = {
						firstName: req.params.firstName
					};
					break;
				case "lastName":
					update = {
						lastName: req.params.lastName
					};
					break;
				case "password":
					let currentPassword = (
						await User.findOne({
							where: {
								id: req.user
							}
						})
					).dataValues.password;
					bcrypt.compare(req.body.currentPassword, currentPassword, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							update = {
								password: req.body.newPassword
							};
						} else {
							return res.json({ message: "Wrong password." }).end();
						}
					});
					break;
				default:
					break;
			}
			let response = await User.update(update, {
				where: {
					id: req.user
				}
			});
			console.log(response);
			res.json(response).end();
		}
	});
};
