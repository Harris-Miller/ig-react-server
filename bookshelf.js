const knex = require('knex');
const bookshelf = require('bookshelf');
const knexConfig = require('./knexfile');

const instance = bookshelf(knex(process.env.NODE_ENV === 'production' ? knexConfig.production : knexConfig.development));
instance.plugin('case-converter');
instance.plugin('registry');

module.exports = instance;
