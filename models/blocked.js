const bookshelf = require('../bookshelf');
require('./user');

const Post = bookshelf.Model.extend({
  tableName: 'blocked',
  user() {
    return this.belongsTo('User', 'user_id');
  }
});

module.exports = bookshelf.model('Post', Post);
