const express = require('express');
// const createError = require('http-errors');
const router = new express.Router();
const Posts = require('../models/post');
// const authenticate = require('../middleware/authenticate');

// temp test route
router.route('/').get((req, res) =>
  Posts
    .forge()
    .orderBy('created_at', 'DESC')
    .fetchAll({ withRelated: { user: query => query.select(['id', 'displayname', 'profile_pic_url']) } })
    .then(results => {
      res.json(results);
    })
);

module.exports = router;
