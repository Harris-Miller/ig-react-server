const bookshelf = require('../bookshelf');
require('./post');
require('./comment');

const User = bookshelf.Model.extend({
  tableName: 'users',
  posts() {
    return this.hasMany('Post');
  },
  comments() {
    return this.hasMany('Comment');
  }
});

module.exports = bookshelf.model('User', User);
