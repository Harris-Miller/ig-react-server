const { promisify } = require('util');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const latinize = require('latinize');
const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const Jimp = require('jimp');
const uuid = require('uuid/v4');
const User = require('../models/user');
const Post = require('../models/post');
// const authenticate = require('../middleware/authenticate');

const router = new express.Router();
const s3 = new S3({ apiVersion: '2006-03-01' });
const upload = multer({ storage: multer.memoryStorage() });

s3.putObjectAsync = promisify(s3.putObject);

const BUCKET_URL = 'https://s3.us-east-2.amazonaws.com/ig-clone-dev';

// temp test route
router.route('/').get((req, res) =>
  User
    .fetchAll({ columns: ['id', 'displayname', 'email', 'created_at', 'updated_at'] })
    // .fetchAll()
    .then(results => {
      res.json(results);
    })
);

router.route('/').post((req, res, next) => {
  const { email, password, displayname } = req.body;

  if (!email || !password || !displayname) {
    return next(new createError.BadRequest('Invalid Credentials'));
  }

  const searchname = latinize(displayname.toLowerCase());
  const searchnameReverse = displayname.split(' ').reverse().join(' ');

  const passwordDigest = bcrypt.hashSync(password, 10);

  return User
    .forge({
      displayname,
      email,
      searchname,
      searchnameReverse,
      passwordDigest
    }, {
      hasTimestamps: true
    })
    .save()
    .then(newUser =>
      // for some reason we have to re-query, otherwise we get back incorrect column names
      // (specifically for timestamp columns)
      User
        .query({ where: { id: newUser.get('id') } })
        .fetch({ columns: ['id', 'displayname', 'email', 'profile_pic_url', 'created_at', 'updated_at'] }))
    .then(newUser => {
      // const { passwordDigest: _1, searchname: _2, searchnameReverse: _3, ...rest } = newUser.toJSON();
      res.status(201);
      res.json(newUser);
    }).catch(err => next(new createError.InternalServerError(err)));
});

router.route('/:id').get((req, res, next) => {
  const { id } = req.params;

  User
    .query({ where: { id: parseInt(id, 10) } })
    .fetch({ columns: ['id', 'displayname', 'email', 'profile_pic_url', 'created_at', 'updated_at'] })
    .then(user => {
      if (!user) {
        return next(new createError.NotFound());
      }

      return res.json(user);
    });
});

router.route('/:id/posts').get((req, res, next) => {
  const { id } = req.params;

  // only fetch the column id for the user, because we're only returning the related data anyways
  // (eg. get min ammount of data needed)
  // Q: why not just do a query on Post?
  // A: because we want to atleast see if the user exists to send back a 404, so we go through the User object
  User
    .where({ id: parseInt(id, 10) })
    .fetch({ columns: ['id'], withRelated: [{ posts: query => { query.select('id', 'text', 'full_url', 'created_at', 'updated_at', 'user_id'); } }] })
    .then(user => {
      if (!user) {
        return next(new createError.NotFound());
      }

      return res.json(user.related('posts'));
    });
});

router.route('/:id/posts').post((req, res, next) => {
  const { id } = req.params;

  // TODO, authorization

  const { text, fullUrl = null } = req.body;

  if (!text) {
    return next(new createError.BadRequest());
  }

  Post
    .forge({ userId: parseInt(id, 10), text, fullUrl }, { hasTimestamps: true })
    .save()
    .then(newPost => res.json(newPost));
});

router.route('/:id/picture').post(upload.single('image'), (req, res, next) => {
  const { file } = req;

  const ext = path.extname(file.originalname);
  const id = uuid();

  const rtnObj = {
    filename: file.originalname
  };

  // first we read the image
  Jimp.read(file.buffer)
    .then(image => {
      image.getBufferAsync = promisify(image.getBuffer);
      // lets take a look at the dimentions
      // if the width is greater then 500
      // then we scale the image down to a width of 500
      if (image.bitmap.width > 500) {
        image.resize(500, Jimp.AUTO);

        const thumbName = `${id}_thumb${ext}`;

        // and save it to s3

        rtnObj.thumbUrl = `${BUCKET_URL}/${thumbName}`;

        return image.getBufferAsync(file.mimetype).then(buffer =>
          s3.putObjectAsync({
            Bucket: 'ig-clone-dev',
            Key: thumbName,
            ACL: 'public-read',
            Body: buffer
          })
        );
      }
    })
    .then(() => {
      // next, save the original
      const fullName = `${id}${ext}`;

      rtnObj.fullUrl = `${BUCKET_URL}/${fullName}`;

      return s3.putObjectAsync({
        Bucket: 'ig-clone-dev',
        Key: fullName,
        ACL: 'public-read',
        Body: file.buffer
      });
    })
    .then(() => res.json(rtnObj))
    .catch(err => next(err));
});

module.exports = router;
