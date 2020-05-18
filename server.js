require("dotenv").config();
// Requiring necessary npm packages
const express = require("express"),
	exphbs = require("express-handlebars"),
	flash = require("connect-flash"),
	passport = require("./config/passport"),
	session = require("express-session"),
	SequelizeStore = require("connect-session-sequelize")(session.Store),
	db = require("./models"),
	PORT = process.env.PORT;

// Creating express app and configuring middleware needed for authentication and sessions
const app = express();
app.use(express.urlencoded({ extended: true }))
	.use(express.json())
	.use(express.static("public"))
	.engine("handlebars", exphbs({ defaultLayout: "main" }))
	.set("view engine", "handlebars")
	// Sessions
	.use(
		session({
			cookie: { maxAge: 6000 * 60 * 24 * 7 },
			secret: process.env.SESS_SECRET,
			resave: true,
			saveUninitialized: false,
			store: new SequelizeStore({ db: db.sequelize })
		})
	)
	.use(passport.initialize())
	.use(passport.session())
	.use(flash())
	.use(function (req, res, next) {
		res.locals.successMsg = req.flash("successMsg");
		res.locals.errorMsg = req.flash("errorMsg");
		next();
	});
// Requiring our routes
require("./routes/handlebar-routes")(app);
require("./routes/user-routes")(app);
require("./routes/content-routes")(app);
require("./routes/comment-routes")(app);
require("./routes/subcomment-routes")(app);

async function main() {
	let errors;
	// Syncing our database and logging a message to the user upon success
	try {
		await db.sequelize.sync();
		app.listen(PORT, (err) => {
			let consoleMsg = process.env.HOST !== "localhost" ? "https://all-for-one-msg.herokuapp.com" : `http://localhost:${PORT}`;
			if (err) throw err;
			else console.log(`Listening at ${consoleMsg}`);
		});
		errors = null;
	} catch (error) {
		console.trace(error);
		errors = error;
	}
	return errors;
}
// Used for testing
module.exports = main;

main();