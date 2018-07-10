const bookshelf = require('../bookshelf');
require('./user');
require('./post');

const Comment = bookshelf.Model.extend({
  tableName: 'comments',
  user() {
    return this.belongsTo('User', 'user_id');
  },
  comment() {
    return this.belongsTo('Post', 'post_id');
  }
});

module.exports = bookshelf.model('Comment', Comment);
