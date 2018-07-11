exports.up = async knex => {
  await knex.schema.createTable('blocked', table => {
    table.increments();
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade');
    table.integer('blocked_id').unsigned();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('blocked');
};
