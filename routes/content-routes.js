// Need User and Post models
const User = require("../models/User");
const Post = require("../models/Post");

module.exports = function (app) {
	// Route for uploading a post
	app.post("/api/posts/upload", async (req, res) => {
		let response = await Post.create({
			title: req.body.title,
			body: req.body.body,
			url: req.body.url,
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes,
			UserId: req.body.UserId,
			lat: req.body.lat,
			long: req.body.long,
		});
		res.json(response).end();
	});
	// GET route for posts by id
	app.get("/api/posts/:id", async (req, res) => {
		let response = await Post.findAll({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
};
