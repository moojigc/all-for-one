module.exports = function (app) {
	const { Comment, Subcomment } = require('../models');
	// Route for POSTing a reply (subcomment) to a parent comment
	app.post("/api/comment/:CommentId/subcomments", async (req, res) => {
		try {
			let response = await Subcomment.create({
				body: req.body.body,
				UserId: req.body.UserId,
				CommentId: parseInt(req.params.CommentId)
			});
			res.json(response).end();
		} catch (error) {
			console.log(error);
			res.json({ message: 'Internal server error.' }).end();
		}
	});
	app.post("/api/subcomment/:SubcommentId/subcomments", async (req, res) => {
		try {
			let response = await Subcomment.create({
				body: req.body.body,
				UserId: req.body.UserId,
				SubcommentId: parseInt(req.params.SubcommentId)
			});
			res.json(response).end();
		} catch (error) {
			console.log(error);
			res.json({ message: 'Internal server error.' }).end();
		}
	});
	// Route for GETting comments for a specific post
	app.get("/api/post/:CommentId/comments", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				CommentId: parseInt(req.params.CommentId)
			}
		});
		res.json(response).end();
	});
	// Route for GETting a specific comment
	app.get("/api/comments/:id", async (req, res) => {
		let response = await Comment.findAll({
			where: {
				CommentId: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
	// Route for PUT request for a specific comment
	app.put("/api/comments/:id", async (req, res) => {
		let response = await Comment.update({
			body: req.body.body,
		}, {
			where: {
				id: parseInt(req.params.id)
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
