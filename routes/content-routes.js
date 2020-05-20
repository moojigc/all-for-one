/* eslint-disable indent */
// const isAuthenticated = require("../config/middleware/isAuthenticated");
// const moment = require("moment");
const serverError = (res) => res.json({ message: "Internal server error.", status: 500 });
module.exports = function (app) {
	const { Post, Vote } = require("../models");
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
	// PUT route for updating posts (body)
	app.put("/api/post/:id/:action", async (req, res) => {
		try {
			console.log(req.url);
			// Check user logged in
			if (!req.user) {
				req.flash("errorMsg", "Must be logged in to vote.");
				res.json({ redirectURL: "/users/login" }).end();
			} else {
				// Find existing values for the post
				let post = (
					await Post.findOne({
						where: {
							id: req.params.id
						},
						include: [
							{
								model: Vote,
								where: {
									UserId: req.user
								},
								required: false
							}
						]
					})
				).dataValues;
				console.log(post.Votes);
				// Destructure the upvote and downvote values
				let { upvotes, downvotes } = post;
				// Function to handle votes
				async function sendVote() {
					// Instead of having the front end send { upvotes: 1 }, it doesn't matter what value it sends.
					// As long as it sends to the right endpoint, it will up/downvote by 1 and save the User's vote for that post.
					// This protects the post from getting its score drastically changed by a bad actor
					let postValues = {};
					let voteValues = {};
					async function handlePostUpdate(values) {
						return await Post.update(values, {
							where: {
								id: req.params.id
							}
						});
					}
					async function handleVoteUpdate(values) {
						return await Vote.upsert({
							lastVoteWas: values,
							id: `p${req.params.id}u${req.user}`,
							PostId: req.params.id,
							UserId: req.user
						});
					}
					console.log(`${upvotes} upvotes. ${downvotes} downvotes`);
					let lastVoteWas = post.Votes[0] ? post.Votes[0].dataValues.lastVoteWas : "none";
					console.log(lastVoteWas);
					// Switch based on whether PUT request is for an upvote or downvote
					switch (req.params.action) {
						case "upvote":
							if (lastVoteWas === "none") {
							// Case that this is the user's first vote on this post or comment, or that the user undid a vote previously
								postValues = { upvotes: parseInt(upvotes) + 1 };
								voteValues = "upvote";
							} else if (lastVoteWas === "upvote") {
								// Undoing an upvote
								postValues = {
									upvotes: parseInt(upvotes) - 1
								};
								voteValues = "none";
							} else if (lastVoteWas === "downvote") {
								// Undoing a downvote and doing an upvote
								postValues = {
									upvotes: parseInt(upvotes) + 1,
									downvotes: parseInt(downvotes) - 1
								};
								voteValues = "upvote";
							}
							break;
						case "downvote":
							if (lastVoteWas === "none") {
								// First vote, or undid a vote
								postValues = {
									downvotes: parseInt(downvotes) + 1
								};
								voteValues = "downvote";
							} else if (lastVoteWas === "upvote") {
								// Undoing an upvote and doing a downvote
								postValues = {
									upvotes: parseInt(upvotes) - 1,
									downvotes: parseInt(downvotes) + 1
								};
								voteValues = "downvote";
							} else if (lastVoteWas === "downvote") {
								// Undoing a downvote
								postValues = { downvotes: parseInt(downvotes) - 1 };
								voteValues = "none";
							}
							break;
						default:
							break;
					}
					console.log(voteValues);
					let postResponse = await handlePostUpdate(postValues);
					let voteResponse = await handleVoteUpdate(voteValues);
					let newPostValues = await Post.findOne({ where: { id: req.params.id }});
					return {
						postResponse,
						voteResponse,
						voteValues,
						upvotes: newPostValues.dataValues.upvotes,
						downvotes: newPostValues.dataValues.downvotes
					};
				}
				if (req.params.action !== "body") {
					let response = await sendVote();
					return res.json(response).end();
				} else {
					let response = await Post.update(
						{
							// Following Reddit's practices, disallowing title/URL updates prevents confusion/deception
							body: req.body.body
						},
						{
							where: {
								id: req.params.id
							}
						}
					);
					res.json(response).end();
				}
			}
		} catch (error) {
			console.log(error);
			serverError(res);
		}
	});
	app.delete("/api/post/:id", async (req, res) => {
		let response = await Post.destroy({
			where: {
				id: parseInt(req.params.id)
			}
		});
		res.json(response).end();
	});
};
