const bookshelf = require('../bookshelf');
const Post = require('./posts');
const Comment = require('./comment');

module.exports = bookshelf.Model.extend({
  tableName: 'users',
  posts() {
    return this.hasMany(Post);
  },
  comments() {
    return this.hasMany(Comment);
  }
});
