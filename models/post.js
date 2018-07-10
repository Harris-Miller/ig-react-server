const bookshelf = require('../bookshelf');
const User = require('./user');
const Comment = require('./comment');

module.exports = bookshelf.Model.extend({
  tableName: 'posts',
  user() {
    return this.belongTo(User);
  },
  comments() {
    return this.hasMany(Comment);
  }
});
