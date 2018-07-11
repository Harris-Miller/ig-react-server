const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const router = new express.Router();
const User = require('../models/user');
// const authenticate = require('../middleware/authenticate');

// temp test route
router.route('/').get((req, res) =>
  User
    // .fetchAll({ columns: ['id', 'displayname', 'email', 'created_at', 'updated_at'] })
    .fetchAll()
    .then(results => {
      res.json(results);
    })
);

router.route('/').post((req, res, next) => {
  const { email, password, displayname } = req.body;

  if (!email || !password || !displayname) {
    return next(new createError.BadRequest('Invalid Credentials'));
  }

  const passwordDigest = bcrypt.hashSync(password, 10);

  return User
    .forge({
      displayname,
      email,
      passwordDigest
    }, {
      hasTimestamps: true
    })
    .save()
    .then(newUser => {
      const { passwordDigest: _, ...rest } = newUser.attributes;
      res.status(201);
      res.json(rest);
    }).catch(err => next(new createError.InternalServerError(err)));
});

router.route('/:id').get((req, res, next) => {
  const { id } = req.params;

  User
    .query({ where: { id: parseInt(id, 10) }})
    .fetch({ columns: ['id', 'displayname', 'profile_pic_url']})
    .then(user => {
      if (!user) {
        return res.next(new createError.NotFound());
      }

      return res.json(user);
    })
});

router.route('/:id/posts').get((req, res, next) => {
  const { id } = req.params;

  User
    .query({ where: { id: parseInt(id, 10) }})
    .fetch({ withRelated: [{ posts: query => { query.select('id', 'text', 'full_url', 'created_at', 'updated_at', 'user_id'); } }] })
    .then(user => {
      if (!user) {
        return next(new createError.NotFound());
      }

      return res.json(user.related('posts'));
    });
});

module.exports = router;
