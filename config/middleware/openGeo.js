const axios = require("axios");

async function reverseLocation(lat, long) {
	let latLong = `${lat}%2C${long}`;
	let url = `https://api.opencagedata.com/geocode/v1/json?q=${latLong}&key=${process.env.OCD_API_KEY}`;
	return await axios.get(url);
}

async function forwardLocation(params) {
	let { city, state, country } = params;
	let query;
	if (!city && state && country) {
		query = encodeURIComponent(`${state},${country}`);
	} else if (!state && city && country) {
		query = encodeURIComponent(`${city},${country}`);
	} else if (!state && !city) {
		query = encodeURIComponent(country);
	} else {
		query = encodeURIComponent(`${city},${state},${country}`);
	}
	console.log(query);
	let url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${process.env.OCD_API_KEY}`;
	return await axios.get(url);
}

module.exports = {
	reverseLocation,
	forwardLocation
};
