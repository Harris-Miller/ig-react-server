const express = require('express');
const createError = require('http-errors');
const latinize = require('latinize');
const router = new express.Router();
// const authenticate = require('../middleware/authenticate');
const User = require('../models/user');

// temp test route
router.route('/').get(/* authenticate,  */(req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new createError.BadRequest('query param "search" is required'));
  }

  const searchLatinized = latinize(search.toLowerCase());

  User
    .query({
      where: ['searchname', 'LIKE', `%${searchLatinized}%`]
      // orWhere: ['searchname_reverse', 'LIKE', search]
    })
    .fetchAll({ columns: ['id', 'displayname', 'profile_pic_url', 'searchname'] })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(new createError.InternalServerError(err)));
});

module.exports = router;
