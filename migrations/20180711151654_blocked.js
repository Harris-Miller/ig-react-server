exports.up = async knex => {
  await knex.schema.createTable('blocked', table => {
    table.increments();
    table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
    table.integer('blocked_id');
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('blocked');
};
