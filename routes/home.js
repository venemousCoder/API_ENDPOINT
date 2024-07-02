const express = require('express')
const router = express.Router(),
  homeControllers = require('../controllers/homeControllers')

/* GET home page. */
router.get('/', homeControllers.home, homeControllers.redirectRoute);
module.exports = router;