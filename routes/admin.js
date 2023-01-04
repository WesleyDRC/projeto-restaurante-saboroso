var express = require("express");
var router = express.Router();

var admin = require('../includes/admin')
var menus = require('../includes/menus')

var adminUsers = require('../includes/adminUsers')

router.use((req, res, next) => {
	if(['/login'].indexOf(req.url) === -1 && !req.session.user) {
		res.redirect('/admin/login')
	} else {
		next()
	}
})

router.use((req, res, next) => {
	req.menus = admin.getMenus(req);

	next()
})

router.get('/logout', (req, res, next) => {
	delete req.session.user

	res.redirect('/admin/login');
})

/* GET home page admin. */
router.get('/', (req, res, next) => {

	admin.dashboard().then((data) => {
		res.render('admin/index', admin.getParams(req, {
			data
		}))
	}).catch((error) => {
		console.log(error)
	})

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
	res.render('admin/contacts', admin.getParams(req))
})

router.get('/emails', (req, res, next) => {
	res.render('admin/emails', admin.getParams(req))
})

router.get('/menus', (req, res, next) => {

	menus.getMenus().then((dataMenus) => {
		res.render('admin/menus', admin.getParams(req, {
			dataMenus
		}))
	}).catch((error) => {
		console.log(error)
	})

})

router.post('/menus', (req, res, next)=> {
	menus.save(req.fields, req.files).then((results) => {
		res.send(results)
	}).catch((error) => {
		console.log(error)
	})
})

router.delete('/menus/:id', (req, res, next) => {
	menus.delete(req.params.id).then(response => {
		res.send(response)
	}).catch((error) => {
		res.send(error)
	})
})

router.get('/reservations', (req, res, next) => {
	res.render('admin/reservations', admin.getParams(req, {
		date: {}
	}))
})

router.get('/users', (req, res, next) => {
	res.render('admin/users', admin.getParams(req))
})

module.exports = router;
