var express = require("express");
var router = express.Router();

var adminUsers = require('../includes/adminUsers')

router.use((req, res, next) => {
	if(['/login'].indexOf(req.url) === -1 && !req.session.user) {
		res.redirect('/admin/login')
	} else {
		next()
	}
})

router.get('/logout', (req, res, next) => {
	delete req.session.user

	res.redirect('/admin/login');
})

/* GET home page admin. */
router.get('/', (req, res, next) => {
	res.render('admin/index')
})

router.get('/login', (req, res, next) => {
	adminUsers.render(req, res, null)
})

router.post('/login', (req, res, next) => {

	if(!req.body.email) {
		adminUsers.render(req, res, "Insira o seu email!")
	} else if (!req.body.password) {
		adminUsers.render(req, res, "Insira a sua senha!")
	} else {
		adminUsers.login(req.body.email, req.body.password).then((user) => {

			req.session.user = user;

			res.redirect("/admin") // redireciona usuários apos logado

		}).catch((error) => {
		adminUsers.render(req, res, error.message || error)
		})
	}
})

router.get('/contacts', (req, res, next) => {
	res.render('admin/contacts')
})

router.get('/emails', (req, res, next) => {
	res.render('admin/emails')
})

router.get('/menus', (req, res, next) => {
	res.render('admin/menus')
})

router.get('/reservations', (req, res, next) => {
	res.render('admin/reservations', {
		date: {}
	})
})

router.get('/users', (req, res, next) => {
	res.render('admin/users')
})

module.exports = router;
