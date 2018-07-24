const express = require('express');
const router = new express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/search', require('./search'));

module.exports = router;
