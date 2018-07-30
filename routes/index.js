var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Queens Library' });
});
/**
 * Add router.get('/book') after comment
 */

 /**
 * Add router.get('/login') after comment
 */
module.exports = router;
