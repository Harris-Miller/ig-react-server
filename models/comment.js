const bookshelf = require('../bookshelf');
const User = require('./user');
const Post = require('./post');

module.exports = bookshelf.Model.extend({
  tableName: 'comments',
  user() {
    return this.belongTo(User);
  },
  comment() {
    return this.belongsTo(Post);
  }
});
