async function imgurPost (file) {

	if (file.length) {
		if (file[0].size > $(this).data("max-size") * 1024) {
			console.log("File is too big");
			return false;
		}

		console.log("Upload");

		var settings = {
			type: "POST",
			url: "https://api.imgur.com/3/image",
			headers: {
				Authorization: "Client-ID e932edc570d9a1f",
				Accept: "application/json"
			},
			mimeType: "multipart/form-data",
			data: file 
		};

		const res = await $.ajax(settings);
		console.log(res);
	}
}


async function sendpost(data) {
	$.post({
		data: data,
		url: "/api/post",
	})
}
function handlepost () {
	$(".submitPost").on("click",async function(event){
		event.preventDefault()
		const file = $("input[type=file]").get(0).files
		const Imgurresponse = imgurPost(file)
		const data = {
			title: $(".title").val(),
			body: $(".body").val(),
			url: $(".url").val(),
		}
		const serverResponse = await sendpost(data)
	})
}