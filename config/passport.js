const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require('bcryptjs');

passport.use(
	new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
		let user = await User.findOne({
			where: {
				username: username
			}
		});
		if (!user) {
			return done(null, false, { message: "Could not find that username." });
		} else {
			// Check password
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: "Password incorrect." });
				}
			});
		}
	})
);

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

module.exports = passport;
