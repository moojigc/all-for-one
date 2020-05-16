const fetch = require("node-fetch");

async function fetchAvatarUrl(userId) {
	const response = await fetch("https://myurl/${userId}");
	const user = await response.json();

	return await Promise.all(
		user.cats.map(async function (catId) {
			const response = await fetch("https://imgur.com/image/${imageId}");
			const catData = await response.json();
			return catData.imageUrl;
		})
	);
}
const result = fetchimages(123);
