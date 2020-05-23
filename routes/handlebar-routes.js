const isAuthenticated = require("../config/middleware/isAuthenticated"),
	moment = require("moment"),
	{ User, Post, Comment, Subcomment, Vote } = require("../models"),
	openCage = require("opencage-api-client"),
	serverError = (res) => res.redirect("/server-error");
function postMap(post, req) {
	let url;
	let lastVote;
	if (req.user) {
		lastVote = post.Votes.length > 0 ? post.Votes[0].dataValues.lastVoteWas : "none";
	} else {
		// Votes is undefined if no user is logged in
		lastVote = "none";
	}
	// Like on reddit, clicking the post either leads you to the outside link or to the individual post's page
	if (!post.url) {
		url = `/post/${post.id}`;
	} else {
		url = post.url;
	}
	// Check for image urls
	post.isImage = () => {
		let regCheck = /\.(gifv?|jpe?g|tiff|png|webp|bmp)$/i.test(post.url);
		if (regCheck) return true;
		else return false;
	};
	console.log(lastVote);
	return {
		id: post.id,
		title: post.title,
		body: post.body,
		username: post.User.dataValues.username,
		userId: post.User.dataValues.id,
		avatar: post.User.dataValues.avatar,
		createdAt: moment(post.createdAt).format("MMMM Do, hh:mm a"),
		url: url,
		isImage: post.isImage,
		comments: post.Comments,
		commentCount: post.Comments.length,
		lat: post.lat,
		long: post.long,
		score: parseInt(post.upvotes) - parseInt(post.downvotes),
		noVote: lastVote === "none" ? lastVote : undefined,
		downvote: lastVote === "downvote" ? lastVote : undefined,
		upvote: lastVote === "upvote" ? lastVote : undefined
	};
}
module.exports = function (app) {
	// Displays the homepage. Checks if the user is authenticated and displays slightly different page if logged in
	app.get("/", isAuthenticated, async (req, res) => {
		try {
			let posts = [];
			let user = {};
			// Check for logged in user
			if (!req.user) {
				// Send a guest user with filler data
				user = {
					username: "Guest",
					lat: 0.0,
					long: 0.0,
					avatar: "https://vignette.wikia.nocookie.net/animalcrossing/images/d/d8/Nook-phone-char-2-2x.png/revision/latest/top-crop/width/360/height/360?cb=20200504020339",
					posts: posts,
					guest: true
				};
				// Find most recent 25 posts
				posts = await Post.findAll({
					limit: 25,
					order: [["upvotes", "DESC"]],
					include: [
						{
							model: User
						},
						{
							model: Comment
						}
					]
					// Map them to exclude the details we don't need, and format nicely for front-end
				}).map((post) => {
					console.log(post);
					return postMap(post, req);
				});
			} else {
				// Find the current user from the userId stored by the session
				user = (await User.findOne({ where: { id: req.user } })).dataValues;
				// Don't want the password
				delete user.password;
				// Location API is inconsistent in its naming for the US
				posts = await Post.findAll({
					limit: 25,
					order: [["upvotes", "DESC"]],
					where: {
						// Just doing country for now.
						country: user.country
					},
					include: [
						{
							model: User
						},
						{
							model: Comment
						},
						{
							model: Vote,
							where: {
								UserId: req.user
							},
							required: false
						}
					]
					// Map them to exclude the details we don't need, and format nicely for front-end
				}).map((post) => {
					return postMap(post.dataValues, req);
				});
				console.log(posts);
				user.loggedIn = true;
			}
			res.render("index", {
				user: user,
				posts: posts
			});
		} catch (error) {
			console.log(error);
			serverError(res);
		}
	});
	// Displays individual post
	app.get("/post/:id", async (req, res) => {
		try {
			// Displays a single post with its comments
			// Unfortunately only goes so many levels deep.
			// Sequelize-hierarchy may be possible future addition
			// Get post
			if (req.user) {
				let [post] = (
					await Post.findAll({
						where: { id: req.params.id },
						include: [
							{
								model: Comment,
								where: { PostId: req.params.id },
								required: false,
								include: [
									{
										model: Subcomment,
										include: [
											{
												model: Subcomment,
												required: false
											}
										]
									},
									{
										model: User
									}
								]
							},
							{
								model: User
							},
							{
								model: Vote,
								where: {
									UserId: req.user
								},
								required: false
							}
						]
					})
				).map((post) => {
					// Map to easier to use object
					return postMap(post, req);
				});
				// Allow user to delete their own posts
				if (req.user === post.userId) {
					post.belongsToCurrentUser = true;
				}
				post.comments = post.comments.map((c) => {
					if (req.user === c.dataValues.UserId) {
						return {
							dataValues: c.dataValues,
							belongsToCurrentUser: true
						};
					} else {
						return {
							dataValues: c.dataValues
						};
					}
				});
				console.log(post.comments);
				res.render("single-post", {
					post: post,
					currentUserId: req.user
				});
			} else {
				let [post] = await Post.findAll({
					where: {
						id: req.params.id
					},
					include: [
						{
							model: Comment,
							include: [
								{
									model: User
								}
							],
							where: { PostId: req.params.id },
							required: false
						},
						{
							model: User
						}
					]
				}).map((post) => {
					return postMap(post, req);
				});
				res.render("single-post", {
					post: post
				});
			}
		} catch (error) {
			console.log(error);
			serverError(res);
		}
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
		try {
			let user = await User.findOne({
				where: {
					id: req.params.id
				}
			});
			res.render("user-info", { user: user });
		} catch (error) {
			console.log(error);
			serverError(res);
		}
	});
	// Making a new post
	app.get("/new-post", async (req, res) => {
		// Must be logged in to post
		if (!req.user) {
			req.flash("errorMsg", "Please log in to post.");
			res.redirect("/users/login");
		} else {
			// Get user info and delete password
			try {
				let user = (
					await User.findOne({
						where: {
							id: req.user
						}
					})
				).dataValues;
				delete user.password;
				res.render("new-post", { user: user });
			} catch (error) {
				console.log(error);
				serverError(res);
			}
		}
	});
	app.get("/server-error", (req, res) => {
		res.render("server-error", {});
	});
};
