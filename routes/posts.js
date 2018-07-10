const express = require('express');
// const createError = require('http-errors');
const router = new express.Router();
const Posts = require('../models/post');
// const authenticate = require('../middleware/authenticate');

// temp test route
router.route('/').get((req, res) =>
  Posts
    .fetchAll({ withRelated: { user: query => query.select(['id', 'displayname', 'profile_pic_url']) } })
    .then(results => {
      res.json(results);
    })
);

// router.route('/').post((req, res, next) => {
//   const { email, password, displayname } = req.body;

//   if (!email || !password || !displayname) {
//     return next(new createError.BadRequest('Invalid Credentials'));
//   }

//   const passwordDigest = bcrypt.hashSync(password, 10);

//   return User
//     .forge({
//       displayname,
//       email,
//       passwordDigest
//     }, {
//       hasTimestamps: true
//     })
//     .save()
//     .then(newUser => {
//       const { passwordDigest: _, ...rest } = newUser.attributes;
//       res.status(201);
//       res.json(rest);
//     }).catch(err => next(new createError.InternalServerError(err)));
// });

module.exports = router;
