async function imgurPost(file) {
	try {
		return await $.post({
			contentType: false,
			processData: false,
			url: "https://api.imgur.com/3/image",
			data: file,
			headers: {
				Authorization: "Client-ID e932edc570d9a1f",
				Accept: "application/json"
			},
			mimeType: "multipart/form-data"
		});
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function handleServerPost() {
	if (window.location.pathname !== "/new-post") return;
	let { lat, long } = await locationHandler();
	async function serverPost(data) {
		return await $.post({
			data: data,
			url: "/api/posts"
		});
	}
	$(".submit-post").on("click", async function (event) {
		event.preventDefault();
		const file = $("input[type=file]").get(0).files;
		let imgurRes;
		if (file.length > 0) {
			imgurRes = JSON.parse(await imgurPost(file[0]));
		}
		console.log(imgurRes);
		const data = {
			title: $(".title").val(),
			body: $(".body").val(),
			lat: lat,
			long: long,
			url: () => {
				if (imgurRes) return imgurRes.data.link;
				else if ($(".url").val() !== "") return $(".url").val();
				else return null;
			},
			deleteHash: () => {
				if (imgurRes) return imgurRes.data.deletehash;
				else return null;
			}
		};
		const serverResponse = await serverPost(data);
		window.location.assign(serverResponse.redirectURL);
	});
}

handleServerPost();
