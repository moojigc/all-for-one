function imgurSubmitHandler() {
	async function imgurSubmit(file) {
		try {
			if (file.size > $(this).data("max-size") * 1024) {
				console.log("File is too big");
				return false;
			}

			console.log("Upload");

			const settings = {
				type: "POST",
				url: "https://api.imgur.com/3/image",
				data: file,
				headers: {
					Authorization: "Client-ID e932edc570d9a1f",
					Accept: "application/json"
				},
				mimeType: "multipart/form-data"
			};
			
			const res = await $.ajax(settings);
			console.log(res);

			// I got an error when trying to use FormData(), so I added the file directly to data.
			// const formData = new FormData();
			// formData.append("image", $files[0]);
			// settings.data = formData;
		} catch (error) {
			console.log(error);
			return error;
		}
	}
	$(".imgur-submit").on("click", async (event) => {
		event.preventDefault();
		let $files = $("input[type=file]").get(0).files;
		if ($files.length) {
			let res = await imgurSubmit($files[0]);
			console.log(res);
		} else {
			console.log("No file selected.");
		}
	});
}
