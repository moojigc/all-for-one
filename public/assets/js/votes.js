async function sendVote(id, action) {
	try {
		return await $.ajax({
			url: `/api/post/${id}/${action}`,
			method: "PUT"
		});
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function voteHandler(event, vote) {
	let id = $(event.target).data("id");
	let res = await sendVote(id, vote);
	let $score = $(event.target).parent().children(".score");
	let newScore = parseInt(res.upvotes) - parseInt(res.downvotes);
	console.log(res);
	if (res.voteValues === "none") {
		$(event.target).removeAttr("style");
		$score.text(newScore);
	} else {
		$(event.target).attr("style", "background-color: orange !important;");
		$score.text(newScore);
	}
}

function handleSendVote() {
	$(".upvote").on("click", async (event) => {
		voteHandler(event, "upvote");
	});
	$(".downvote").on("click", async (event) => {
		voteHandler(event, "downvote");
	});
}
handleSendVote();
