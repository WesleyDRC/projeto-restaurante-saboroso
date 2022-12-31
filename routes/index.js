var connection = require("../includes/db")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  connection.query(
    "SELECT * FROM TB_MENUS ORDER BY TITLE", (err, results) => {
      if (err) {
        console.log(err)
      }

      res.render('index',
        {
          title: 'Restaurante Saboroso!',
          menus: results
        });

    }
  )
});

module.exports = router;
