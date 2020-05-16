const isAuthenticated = require('../config/middleware/isAuthenticated');
const User = require('../models/User');

module.exports = function(app) {
	app.get("/", (req, res) => {
		res.render('index', {});
	});
	app.get('/users/login', (req, res) => {
		res.render('login', {});
	});
	app.get('/users/register', (req, res) => {
		res.render('register', {});
	});
	app.get('/users/info', isAuthenticated, async (req, res) => {
		let user = await User.findOne({
			where: {
				username: req.user.username
			}
		})
		res.json(user).end();
	})
};
