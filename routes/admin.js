var express = require("express");
var router = express.Router();

var moment = require('moment')
moment.locale('pt-BR')

var admin = require('../includes/admin')
var menus = require('../includes/menus')
var reservations = require('../includes/reservations')
var emails = require('../includes/emails')

var adminUsers = require('../includes/adminUsers');
var contacts = require("../includes/contacts");


module.exports = function(io) {

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

	router.get('/dashboard', (req, res, next) => {
		reservations.dashboard().then(data => {
			res.send(data)
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
		contacts.getContacts().then((data) => {
			res.render('admin/contacts', admin.getParams(req, {
				data
			}))
		}).catch((error) => {
			res.send(error)
		})
	})

	router.delete('/contacts/:id', (req, res, next) => {
		contacts.delete(req.params.id).then((results) => {
			res.send(results);
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
	})

	router.get('/emails', (req, res, next) => {
		emails.getEmails().then((data) => {
			res.render('admin/emails', admin.getParams(req, {
				data
			}))
		})
	})

	router.delete('/emails/:id', (req, res, next) => {
		emails.delete(req.params.id).then(response => {
			res.send(response)
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
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
			io.emit('dashboard update');
		}).catch((error) => {
			console.log(error)
		})
	})

	router.delete('/menus/:id', (req, res, next) => {
		menus.delete(req.params.id).then(response => {
			res.send(response)
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
	})

	router.get('/reservations', (req, res, next) => {

		let start = (req.query.start) ? req.query.start : moment().subtract(20, "year").format("YYYY-MM-DD");
		let end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

		reservations.getReservations(
			req
		).then(pag => {
			res.render('admin/reservations', admin.getParams(req, {
				date: {
					start,
					end
				},
				data: pag.data,
				moment,
				links: pag.links
			}))
		}).catch(error => {
			console.log(error)
		})

	})

	router.get('/reservations/chart', (req, res, next) => {

		req.query.start = (req.query.start) ? req.query.start : moment().subtract(20, "year").format("YYYY-MM-DD");
		req.query.end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

		reservations.chart(req).then((chartData) => {
			res.send(chartData);
		})

	})

	router.post('/reservations', (req, res, next)=> {
		reservations.save(req.fields, req.files).then((results) => {

			io.emit('dashboard update');
			res.send(results)

		}).catch((error) => {
			console.log(error)
		})
	})

	router.delete('/reservations/:id', (req, res, next) => {
		reservations.delete(req.params.id).then(response => {
			res.send(response)
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
	})

	router.get('/users', (req, res, next) => {

		adminUsers.getUsers().then(data => {
			res.render('admin/users', admin.getParams(req, {
				data
			}))
		})
	})

	router.post('/users', (req, res, next) => {
		adminUsers.save(req.fields).then(response=> {
			res.send(response)
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
	})

	router.post('/users/password-change', (req,res,next) => {
		adminUsers.changePassword(req).then(response=> {
			res.send(response)
		}).catch((err) => {
			res.send({
				error: err
			})
		})
	})

	router.delete('/users/:id', (req, res, next) => {
		adminUsers.delete(req.params.id).then(response=> {
			res.send(response)
			io.emit('dashboard update');
		}).catch((error) => {
			res.send(error)
		})
	})

	return router;
};
