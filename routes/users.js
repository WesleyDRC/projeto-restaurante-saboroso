var connection = require('./../includes/db.js')

var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {

  connection.query(
    "SELECT * FROM tb_users", (err, results) => {
      if(err) {
        res.send(err)
      } else {
        res.send(results)
      }
    }
  )

});

module.exports = router;
