const isAuthenticated = require("../config/middleware/isAuthenticated"),
	User = require("../models/User"),
	Post = require("../models/Post"),
	Comment = require("../models/Comment"),
	Subcomment = require("../models/Subcomment"),
	moment = require("moment");

module.exports = function (app) {
	// Displays the homepage. Checks if the user is authenticated and displays slightly different page if logged in
	app.get("/", isAuthenticated, async (req, res) => {
		try {
			// Find most recent 25 posts
			let posts = await Post.findAll({
				limit: 25,
				order: [["updatedAt", "DESC"]],
				include: [
					{
						model: User
					},
					{
						model: Comment
					}
				]
				// Map them to exclude the details we don't need, and format nicely for front-end
			}).map(async (post) => {
				let url;
				if (!post.url) {
					url = `/post/${post.id}`;
				} else {
					url = post.url;
				}
				return {
					id: post.id,
					title: post.title,
					body: post.body,
					username: post.User.dataValues.username,
					createdAt: moment(post.createdAt).format("hh:mm a"),
					updatedAt: moment(post.updatedAt).format("hh:mm a"),
					url: url,
					commentCount: post.Comments.length,
					lat: post.lat,
					long: post.long,
					upvotes: post.upvotes,
					downvotes: post.downvotes
				};
			});
			console.log(posts);
			// Check for logged in user
			if (!req.user) {
				let emptyUser = {
					username: "Guest",
					posts: posts
				};
				res.render("index", {
					user: emptyUser,
					posts: posts
				});
			} else {
				// Find the current user from the userId stored by the session
				let results = await User.findOne({ where: { id: req.user } });
				// Save it in an easier-to-type var
				let currentUser = results.dataValues;
				// Don't want the password
				delete currentUser.password;
				res.render("index", {
					user: currentUser,
					posts: posts
				});
			}
		} catch (error) {
			console.log(error);
		}
	});
	// Displays a single post with its comments
	// Unfortunately only goes so many levels deep.
	// Sequelize-hierarchy may be possible future addition
	app.get("/post/:id", async (req, res) => {
		// Get post
		let post = (
			await Post.findOne({
				where: { id: req.params.id },
				include: [
					{
						model: Comment,
						where: { PostId: req.params.id },
						include: [
							{
								model: Subcomment,
								include: [
									{
										model: Subcomment
									}
								]
							}
						]
					},
					{
						model: User
					}
				]
			})
		).dataValues;
		// Map to easier to use object
		post = {
			data: post,
			Comments: post.Comments,
			User: post.User.dataValues
		};
		// Delete the duplicate values and password
		delete post.data.User;
		delete post.data.Comments;
		delete post.User.password;
		console.log(post.Comments[0].Subcomments);
		res.render("single-post", {
			post: post
		});
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
	app.get("/user/:id/info", isAuthenticated, async (req, res) => {
		let user = await User.findOne({
			where: {
				id: req.params.id
			}
		});
		res.render("user-info", { user: user });
	});
	// Making a new post
	app.get("/new-post", async (req, res) => {
		// Must be logged in to post
		if (!req.user) {
			req.flash("errorMsg", "Please log in to post.");
			res.redirect("/login");
		} else {
			// Get user info and delete password
			let user = (await User.findOne({
				where: {
					id: req.user
				}
			})).dataValues;
			delete user.password;
			res.render("new-post", { user: user });
		}
	});
};
