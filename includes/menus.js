let connection = require('./db.js')

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
	}
}
