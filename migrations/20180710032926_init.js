exports.up = function (knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('displayname').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
