// Need all user models
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = function (app) {
	// Route for POSTing a comment to a specific Post
	app.post("/api/post/:PostId/comments", async (req, res) => {
		let response = await Comment.create({
			body: req.body.body,
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes,
			UserId: req.body.UserId,
			PostId: parseInt(req.params.PostId)
		});
		res.json(response).end();
	});
	// Route for GETting comments for a specific post
	app.get("/api/post/:PostId/comments", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				PostId: parseInt(req.params.PostId)
			}
		});
		res.json(response).end();
	});
	// Route for GETting a specific comment
	app.get("/api/comments/:id", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				PostId: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
	// Route for GETting a specific user's comments
	app.get("/api/users/:UserId/comments", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				UserId: parseInt(req.params.UserId)
			}
		});
		res.json(response).end();
	});
};
