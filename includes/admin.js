var connection = require('./db')

module.exports = {

	dashboard() {
		return new Promise((resolve, reject) => {
			connection.query(`
				SELECT
				(SELECT COUNT(*)FROM tb_contacts) as totalContacts,
					(SELECT COUNT(*)FROM tb_emails) as totalEmails,
					(SELECT COUNT(*)FROM tb_menus) as totalMenus,
					(SELECT COUNT(*)FROM tb_reservations) as totalReservations,
					(SELECT COUNT(*)FROM tb_users) as totalUsers;
			`, (err, results) => {
				if(err) {
					reject(err)
				} else {
					resolve(results[0])
				}
			})
		})
	},

	getParams(req, params) {
		return Object.assign({}, {
			menus: req.menus,
			user: req.session.user,
		}, params)
	},

	getMenus(req) {
		let menus =  [
			{
				text: "Tela Inicial",
				href: "/admin/",
				icon: "home",
				active: false
			},
			{
				text: "Menu",
				href: "/admin/menus",
				icon: "cutlery",
				active: false
			},
			{
				text: "Reservas",
				href: "/admin/reservations",
				icon: "calendar-check-o",
				active: false
			},
			{
				text: "Contatos",
				href: "/admin/contacts",
				icon: "comments",
				active: false
			},
			{
				text: "Usuários",
				href: "/admin/users",
				icon: "users",
				active: false
			},
			{
				text: "E-mails",
				href: "/admin/emails",
				icon: "envelope",
				active: false
			},
		];

		menus.map((menu) => {

			if(menu.href === `/admin${req.url}`) menu.active = true;
			console.log(req.url, menu.href)

		})

		return menus;
	}

}
