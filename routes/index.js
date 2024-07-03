var express = require('express');
var router = express.Router(),
    apiRouter = require('./api');
/******************************************** USE BIND ALL ROUTES ***********************************/

router.use('/api', apiRouter);


module.exports = router;