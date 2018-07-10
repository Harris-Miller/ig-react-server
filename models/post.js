const bookshelf = require('../bookshelf');
require('./user');
require('./comment');

const Post = bookshelf.Model.extend({
  tableName: 'posts',
  user() {
    return this.belongsTo('User', 'user_id');
  },
  comments() {
    return this.hasMany('Comment');
  }
});

module.exports = bookshelf.model('Post', Post);
