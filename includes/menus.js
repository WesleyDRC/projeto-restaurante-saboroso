let connection = require('./db.js')
let path = require('path')

module.exports = {
	getMenus() {
		return new Promise((resolve, reject) => {
			connection.query(`
				SELECT * FROM TB_MENUS ORDER BY TITLE
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

			fields.photo = `images/${path.parse(files.photo.filepath).base}`

			let query, queryPhoto = '', params = [
				fields.title,
				fields.description,
				fields.price,
			];

			if(files.photo.originalFilename) {

				queryPhoto = ',photo = ?'
				params.push(fields.photo)

			}

			if(parseInt(fields.id) > 0 ) {

				params.push(fields.id)

				query = `
					UPDATE tb_menus
						SET title = ?,
							description = ? ,
								price = ?
									${queryPhoto}
						WHERE id = ?
				`;
			} else {
				if(!files.photo.originalFilename) {
					reject("É obrigatório o envio da foto do prato!")
				}
				query = `
				INSERT INTO tb_menus (title, description, price, photo) VALUES (?, ?, ?, ?)
			`;
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
				DELETE FROM tb_menus WHERE id = ?
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
