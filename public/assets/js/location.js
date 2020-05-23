async function locationHandler() {
	function getPosition(options) {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}
	try {
		let { coords } = await getPosition();
		return {
			lat: coords.latitude,
			long: coords.longitude
		};
	} catch (noLoc) {
		return {
			lat: null,
			long: null,
			noLoc
		};
	}
}
