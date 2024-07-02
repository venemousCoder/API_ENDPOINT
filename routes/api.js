const router = require("express").Router();
const apiController = require("../controllers/apiControllers");

router.get('/hello', apiController.apiResponse);

module.exports = router;
