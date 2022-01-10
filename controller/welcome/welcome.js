require('express-async-errors');
const router = require('express').Router();
const {response} = require('../../utils/response');

router.get('/', (req, res, next) => {
  return response(res, next, 200, 'welcome', null);
});

module.exports = router;
