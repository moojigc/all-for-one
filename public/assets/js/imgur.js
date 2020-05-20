$("input[type=file]").on("change", async function () {
	var $files = $(this).get(0).files;

	if ($files.length) {
		if ($files[0].size > $(this).data("max-size") * 1024) {
			console.log("File is too big");
			return false;
		}

		console.log("Upload");

		var settings = {
			type: "POST",
			url: apiUrl,
			headers: {
				Authorization: clientId + apiKey,
				Accept: "application/json"
			},
			mimeType: "multipart/form-data"
		};

		var formData = new FormData();
		formData.append("image", $files[0]);
		settings.data = formData;

		const res = await $.ajax(settings);
		console.log(res);
	}
});
