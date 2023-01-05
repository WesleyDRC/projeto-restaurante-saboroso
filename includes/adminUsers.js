var connection = require('./db')

module.exports = {

	render(req, res, error) {
		res.render('admin/login', {
			body: req.body,
			error
		})
	},

	login(email, password) {
		return new Promise((resolve, reject) => {
			connection.query(`
			SELECT * FROM tb_users WHERE email = ?
			`, [
				email
			], (err, results) => {
				if(err) {
					reject(err)
				} else {

					if(!results.length > 0) {
						reject("Usuário ou senha incorretos.")
					} else {
						let row = results[0];
						if(row.password !== password) {
							reject("Usuário ou senha incorretos.")
						} else {
							resolve(row);
						}
					}
				}
			})
		})
	},

	getUsers() {
		return new Promise((resolve, reject) => {
			connection.query(`
				SELECT * FROM tb_users ORDER BY ID
			`, (err, results) => {
				if(err) {
					reject(err)
				}

				resolve(results)

			})
		})
	},

	save(fields, files) {
		return new Promise((resolve, reject) => {

			let query, queryPhoto= '', params = [
				fields.name,
				fields.email
			];

			if(parseInt(fields.id) > 0 ) {

				params.push(fields.id)

				query = `
				UPDATE tb_users
					SET name = ?,
							email = ?
				WHERE id = ?
				`;
			} else {

				query = `
				INSERT INTO tb_users (name, email, password) VALUES (?, ?, ?)
			`;

			params.push(fields.password)
			}

			connection.query(query, params, (err, results) => {
				if(err) {
					reject(err)
				} else {
					resolve(results)
				}
			})
		})
	},

	delete(id) {
		return new Promise((resolve, reject) => {
			connection.query(`
				DELETE FROM tb_users WHERE id = ?
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
	},

	changePassword(req) {
		return new Promise((resolve, reject) => {
			if(!req.fields.password) {
				reject("Preêncha a senha!")
			} else if(req.fields.password !== req.fields.passwordConfirm) {
				reject("As duas senhas devem ser idênticas!")
			} else {
				connection.query(`
					UPDATE tb_users
						SET password = ?
					WHERE ID = ?
				`, [
					req.fields.password,
					req.fields.id
				], (err, results) => {
					if(err) {
						reject(err.message)
					} else {
						resolve(results)
					}
				})
			}
		})
	}
}
