async function postUser(data) {
	return await $.post({
		url: "/api/users",
		data: data
	});
}

async function handleRegistration() {
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
		console.log(user);
		let response = await postUser(user);
		window.location.assign(response.redirectURL);
	});
}

handleRegistration();
