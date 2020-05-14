// Requiring necessary npm packages
const express = require("express"),
	session = require("express-session"),
// Requiring passport as we've configured it
	passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 4000,
	db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }))
	.use(express.json())
	.use(express.static("public"))
	// We need to use sessions to keep track of our user's login status
	.use(session({
			secret: process.env.SESS_SECRET ? process.env.SESS_SECRET : "himitsu",
			resave: true,
			saveUninitialized: true,
		})
	)
	.use(passport.initialize())
	.use(passport.session());
// Requiring our routes
require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync({ force: true }).then(function () {
	app.listen(PORT, function (err) {
		if (err) throw err;
		console.log('Listening on ' + process.env.PORT ? 'https://all-for-one-msg.herokuapp.com' : `http://localhost:${PORT}`);
	});
});
