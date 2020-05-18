// const isAuthenticated = require("../config/middleware/isAuthenticated");
// const moment = require("moment");

module.exports = function (app) {
	const { Post } = require('../models');
	// POST route for uploading a post (POST a post)
	app.post("/api/posts/", async (req, res) => {
		let response = await Post.create({
			title: req.body.title,
			body: req.body.body,
			url: req.body.url,
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes,
			UserId: req.body.UserId,
			lat: req.body.lat,
			long: req.body.long
		});
		res.json(response).end();
	});
	// GET route for posts by id
	app.get("/api/post/:id", async (req, res) => {
		let response = await Post.findAll({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
	// GET route for all posts
	app.get("/api/posts/", async (req, res) => {
		let response = await Post.findAll({});
		res.json(response).end();
	});
	// PUT route for updating posts (body and voting only)
	app.put("/api/posts/:id", async (req, res) => {
		if (req.body.body) {
			let response = await Post.update(
				{
					// Following Reddit's practices, disallowing title/URL updates prevents confusion/deception
					body: req.body.body
				},
				{
					where: {
						id: parseInt(req.params.id)
					}
				}
			);
			res.json(response).end();
		} else if (req.body.upvotes) {
			let response = await Post.update(
				{
					upvotes: req.body.upvotes
				},
				{
					where: {
						id: parseInt(req.params.id)
					}
				}
			);
			res.json(response).end();
		} else if (req.body.downvotes) {
			let response = await Post.update(
				{
					downvotes: req.body.downvotes
				},
				{
					where: {
						id: parseInt(req.params.id)
					}
				}
			);
			res.json(response).end();
		}
	});
	app.delete("/api/posts/:id", async (req, res) => {
		let response = await Post.destroy({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
};
