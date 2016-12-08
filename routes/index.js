var express = require('express');
var router = express.Router();
var path = require('path');



/* Route stock page. */
router.get(['/','/stock'], function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
