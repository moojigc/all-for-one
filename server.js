// Requiring necessary npm packages
const express = require("express"),
	session = require("express-session"),
	exphbs = require('express-handlebars'),
	// Requiring passport as we've configured it
	passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 4000,
	sequelize = require('./config/connection');
require('./models/Post');
require('./models/Comment');

// Creating express app and configuring middleware needed for authentication
const app = express();
app
	.use(express.urlencoded({ extended: true }))
	.use(express.json())
	.use(express.static("public"))
	.engine("handlebars", exphbs({ defaultLayout: "main" }))
	.set("view engine", "handlebars")
	// Sessions
	.use(
		session({
			secret: process.env.SESS_SECRET ? process.env.SESS_SECRET : "himitsu",
			resave: true,
			saveUninitialized: true,
		})
	)
	.use(passport.initialize())
	.use(passport.session());
// Requiring our routes
require("./routes/handlebar-routes")(app);
require("./routes/user-routes")(app);
require("./routes/content-routes")(app);
require("./routes/comment-routes")(app);

async function main() {
	// Syncing our database and logging a message to the user upon success
	try {
		await sequelize.sync();
		app.listen(PORT, err => {
			if (err) throw err;
			else console.log("Listening on " + process.env.PORT ? `http://localhost:${PORT}` : "https://all-for-one-msg.herokuapp.com");
		});
	} catch (error) {
		console.trace(error);
	}
}

main();