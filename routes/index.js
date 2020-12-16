const router = require('express').Router();

// user routes
router.use('/', require('./users'));

// card routes
router.use('/', require('./articles'));

module.exports = router;