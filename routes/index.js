const router = require('express').Router();

router.use('/', require('./users'));
router.use('/', require('./articles'));

module.exports = router;
