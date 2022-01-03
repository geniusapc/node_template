require('express-async-errors');
const router = require('express').Router();

router.get('/', (req, res) => {
  return res.send('Hello');
})


module.exports = router;
