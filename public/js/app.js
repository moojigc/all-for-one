<<<<<<< HEAD
$("input[type=file]").on("change", function () {
	var $files = $(this).get(0).files;

	if ($files.length) {
		// Reject big files
		if ($files[0].size > $(this).data("max-size") * 1024) {
			console.log("Please select a smaller file");
			return false;
		}

		console.log("Upload");

		var settings = {
			async: false,
			crossDomain: true,
			processData: false,
			contentType: false,
			type: "POST",
			url: apiUrl,
			headers: {
				Authorization: "e932edc570d9a1f" + apiKey,
				Accept: "application/json"
			},
			mimeType: "multipart/form-data"
		};

		var formData = new FormData();
		formData.append("image", $files[0]);
		settings.data = formData;

		$.ajax(settings).done(function (response) {
			console.log(response);
		});
	}
=======
$('input[type=file]').on("change", async function () {

    var $files = $(this).get(0).files;

    if ($files.length) {

      
        if ($files[0].size > $(this).data("max-size") * 1024) {
            console.log("File is too big");
            return false;
        }


        console.log("Upload");

     

        var settings = {
            type: 'POST',
            url: apiUrl,
            headers: {
                Authorization: clientId + apiKey,
                Accept: 'application/json'
            },
            mimeType: 'multipart/form-data'
        };

        var formData = new FormData();
        formData.append("image", $files[0]);
        settings.data = formData;


        const res =  await $.ajax(settings)
            console.log(res);
    }
>>>>>>> 4bc7c91234ed85b50acaddac133088e1e5fe5504
});
