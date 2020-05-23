function handlePostDeletion() {
	async function deletePostRequest(id) {
		return await $.ajax({
			url: `/api/post/${id}`,
			method: "DELETE"
		});
	}

	$(".delete-post").on("click", async (event) => {
		event.preventDefault();
		let id = $(event.target).data("id");
		let serverRes = await deletePostRequest(id);
		window.location.assign(serverRes.redirectURL);
	});
}

function handleCommentDeletion() {
	async function deleteComment(id, postId) {
		return await $.ajax({
			url: `/api/post/${postId}/comment/${id}`,
			method: 'DELETE'
		});
	};

	$(".delete-comment").on("click", async event => {
		event.preventDefault();
		let id = $(event.target).data('id');
		let postId = $(event.target).data('postid');
		let serverRes = await deleteComment(id, postId);
		window.location.assign(serverRes.redirectURL);
	});
}

handlePostDeletion();
handleCommentDeletion();