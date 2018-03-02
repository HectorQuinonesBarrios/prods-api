const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(require(__dirname+"/../json/prods.json"));
});

module.exports = router;
