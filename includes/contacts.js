var connection = require('./db')

module.exports = {
	render(req, res, error, success) {
		res.render("contacts", {
			title: "Contatos - Restaurante Saboroso!",
			backgroundHeader: "images/img_bg_3.jpg",
			h1: "Diga um oi!",
			body: req.body,
			error,
			success
		})
	},

	save(fields) {
		return new Promise((resolve, reject) => {
			connection.query(`
				INSERT INTO tb_contacts (name, email, message) VALUES (?, ?, ?)
			`, [
				fields.name,
				fields.email,
				fields.message
			], (err, results) => {
				if(err) {
					reject(err)
				} else {
					resolve(results)
				}
			})
		})
	},

	getContacts() {
		return new Promise((resolve, reject) => {
			connection.query(`
				SELECT * FROM tb_contacts ORDER BY register DESC
			`, (err, results) => {
				if(err) {
					reject(err)
				}

				resolve(results)

			})
		})
	},

	delete(id) {
		return new Promise((resolve, reject) => {
			connection.query(`
				DELETE FROM tb_contacts WHERE id = ?
			`, [
				id
			], (err, results) => {
				if(err) {
					reject(err)
				} else {
					resolve(results)
				}
			})
		})
	}
}
