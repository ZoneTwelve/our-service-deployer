var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if( req.session.user.login )
    return res.render('dashboard', { user:req.session.user });
  return res.render('index', { title: 'OSD' });
});

module.exports = router;
