module.exports = function (app) {
	const { Comment, Subcomment } = require('../models');
	// Route for POSTing a comment to a specific Post
	app.post("/api/post/:PostId/comments", async (req, res) => {
		let response = await Comment.create({
			body: req.body.body,
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes,
			UserId: req.body.UserId,
			PostId: req.params.PostId
		});
		res.json(response).end();
	});
	// Route for GETting comments for a specific post
	app.get("/api/post/:PostId/comments", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				PostId: req.params.PostId
			},
			include: [
				{
					model: Subcomment
				}
			]
		});
		res.json(response).end();
	});
	// Route for GETting a specific comment
	app.get("/api/comment/:id", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				id: req.params.id
			},
			include: [
				{
					model: Subcomment
				}
			]
		});
		res.json(response).end();
	});
	// Route for PUT request for a specific comment
	app.put("/api/comment/:id", async (req, res) => {
		let response = await Comment.update(
			{
				body: req.body.body
			},
			{
				where: {
					id: parseInt(req.params.id)
				}
			}
		);
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
