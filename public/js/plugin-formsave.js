HTMLFormElement.prototype.save = function (config) {

	let form = this;

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		let formData = new FormData(form);

		fetch(form.action, {
			method: form.method,
			body: formData
		})
			.then(resp => resp.json())
			.then(data => {

				if(data.error) {
					if(typeof config.failure === "function") config.failure(data.error)
				} else {
					if(typeof config.failure === "function") config.success(data)
				}

			}).catch((error) => {
				if(typeof config.failure === "function") config.failure(error)
			})
	});


}
