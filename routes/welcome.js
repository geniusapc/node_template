require('express-async-errors');
const router = require('express').Router();

const welcome = require("../controller/welcome/welcome")

router.get('/', welcome)


module.exports = router;
