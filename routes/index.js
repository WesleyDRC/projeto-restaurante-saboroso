var connection = require("../includes/db");
var menus = require("../includes/menus");
var reservations = require("../includes/reservations")
var contacts = require('../includes/contacts')
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  menus
    .getMenus()
    .then((results) => {
      res.render("index", {
        title: "Restaurante Saboroso!",
        menus: results,
        isHome: true,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/contacts", function (req, res, next) {
  res.render("contacts", {
    title: "Contatos - Restaurante Saboroso!",
    backgroundHeader: "images/img_bg_3.jpg",
    h1: "Diga um oi!",
  });
});

router.post("/contacts", function (req, res, next) {

  if(!req.body.name) {
    contacts.render(req, res, "Insira o seu nome!")
  } else if(!req.body.email) {
    contacts.render(req, res, "Insira o seu email!")
  } else if (!req.body.message) {
    contacts.render(req, res, "Insira a sua mensagem!")
  } else {
    contacts.save(req.body).then(() => {
      req.body = {}
      contacts.render(req, res, null, "Sua mensagem foi enviada com sucesso, em breve retornaremos.")
    }).catch((error) => {
      contacts.render(req, res, error.message)
    })
  }
})

router.get("/menus", function (req, res, next) {
  menus
    .getMenus()
    .then((results) => {
      res.render("menus", {
        title: "Menus - Restaurante Saboroso!",
        backgroundHeader: "images/img_bg_1.jpg",
        h1: "Saboreie nosso menu!",
        menus: results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/reservations", function (req, res, next) {

  reservations.render(req, res);

});

router.post("/reservations", function (req, res, next) {

  if (!req.body.name) {
    reservations.render(req, res, "Preêncha o campo nome!");
  } else if (!req.body.email) {
    reservations.render(req, res, "Preêncha o campo email!");
  } else if (!req.body.people) {
    reservations.render(req, res, "Preêncha o campo pessoas!");
  } else if (!req.body.date) {
    reservations.render(req, res,"Preêncha o campo data!");
  } else if (!req.body.time) {
    reservations.render(req, res, "Preêncha o campo hora!");
  } else {
    reservations.save(req.body).then(() => {

      req.body = {};
      reservations.render(req, res, null, "Reserva realizada com sucesso!");


    }).catch((error) => {
      reservations.render(req, res, error.message)
    })
  }

});

router.get("/services", function (req, res, next) {
  res.render("services", {
    title: "Serviços - Restaurante Saboroso!",
    backgroundHeader: "images/img_bg_1.jpg",
    h1: "É um prazer poder servir!",
  });
});

module.exports = router;
