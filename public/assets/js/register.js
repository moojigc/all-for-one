async function postUser(data) {
	try {
		return await $.post({
			url: "/api/users",
			data: data
		});
	}
	catch (error) {
		return error;
	}
}

async function handleRegistration() {
	if (window.location.pathname !== "/users/register") return;
	// Get the user's location
	let { lat, long, noLoc } = await locationHandler();
	if (noLoc) {
		$('.location').fadeIn('fast');
	}
	$(".register").on("click", async (event) => {
		event.preventDefault();
		let $year = $("#year").val(),
			$month = $("#month").val(),
			$day = $("#day").val();
		const user = {
			username: $("#username").val(),
			password: $("#password").val(),
			password2: $("#password2").val(),
			firstName: $("#first-name").val(),
			lastName: $("#last-name").val(),
			birthdate: () => {
				if ($year !== "" && $month !== "" && $day !== "") return `${$year}-${$month}-${$day}`;
				else return null;
			},
			avatar: $("#avatar").val()
		};
		// Send these values if user rejects location
		if (noLoc) {
			user.country = $('#country').val();
			user.state = $("#state").val() !== "" ? $("#state").val() : null;
			user.city = $("#city").val() !== "" ? $("#city").val() : null;
		// Else send browser latitude and longitude
		} else {
			user.lat = lat;
			user.long = long;
		}
		console.log(user);
		let response = await postUser(user);
		console.log(response);
		// Ajax prevents actual redirects so you have to mimic it with this function and custom server response
		window.location.assign(response.redirectURL);
	});
}

handleRegistration();
