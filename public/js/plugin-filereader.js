class PluginFileReader {

	constructor(inputEl, imageEl) {
		this.inputEl = inputEl
		this.imageEl = imageEl

		this.initInputEvent();
	}

	reader(file) {

		return new Promise((resolve, reject) => {
			let reader = new FileReader()

			reader.onload = function() {

				resolve(reader.result)

			}

			reader.onerror = function () {
				reject("Não foi possível ler a imagem!")
			}

			reader.readAsDataURL(file)
		})

	}

	initInputEvent() {
		document.querySelector(this.inputEl).addEventListener("change", (e) => {
			this.reader(e.target.files[0]).then(result => {
				document.querySelector(this.imageEl).src = result
			})
		})
	}

}
