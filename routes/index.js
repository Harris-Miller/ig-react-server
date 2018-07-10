const express = require('express');
const router = new express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));

module.exports = router;
