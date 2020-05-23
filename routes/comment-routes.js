module.exports = function (app) {
	const { Comment, Subcomment } = require('../models');
	// Route for POSTing a comment to a specific Post
	app.post("/api/post/:PostId/comments", async (req, res) => {
		if (!req.user) {
			req.flash("errorMsg", "You must be logged in to comment!");
			req.redirect(`/post/${req.params.PostId}`);
		}
		try {
			await Comment.create({
				body: req.body.body,
				UserId: req.body.UserId,
				PostId: req.params.PostId
			});
			res.redirect(`/post/${req.params.PostId}`);
		} catch (error) {
			console.log(error);
			req.flash("errorMsg", "Internal error. Please try again later.");
			req.redirect(`/post/${req.params.PostId}`);
		}
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
