require("dotenv").config();
const opencage = require("opencage-api-client");

opencage
	.geocode({ q: "lyon" })
	.then((data) => {
		console.log(JSON.stringify(data, null, 2));
	})
	.catch((error) => {
		console.log("error", error.message);
	});