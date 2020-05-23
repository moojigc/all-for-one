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
	if (res.redirectURL) {
		window.location.assign(res.redirectURL);
	} else {
		let $score = $(event.target).parent().children(".score");
		let newScore = res.score;
		console.log(res);
		$(event.target).parent().children('button').get().forEach(b => $(b).removeAttr("style"));
		if (res.voteValues === "none") {
			$score.text(newScore);
		} else {
			$(event.target).attr("style", "background-color: orange !important;");
			$score.text(newScore);
		}
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
