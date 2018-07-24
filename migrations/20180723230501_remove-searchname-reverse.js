
exports.up = async knex => {
  await knex.schema.table('users', table => {
    table.dropColumn('searchname_reverse');
  });
};

exports.down = async knex => {
  await knex.schema.table('users', table => {
    table.string('searchname_reverse').notNullable().index();
  });
};
