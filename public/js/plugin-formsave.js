HTMLFormElement.prototype.save = function () {

	let form = this;

	return new Promise ((resolve, reject) => {
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			let formData = new FormData(form);

			fetch(form.action, {
				method: form.method,
				body: formData
			})
				.then(resp => resp.json())
				.then(data => {
					resolve(data)
				}).catch((error) => {
					reject(error)
				})
		});

	})


}
