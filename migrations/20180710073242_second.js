exports.up = async knex => {
  await knex.schema.table('users', table => {
    table.string('searchname').notNullable().index();
    table.string('searchname_reverse').notNullable().index();
    table.string('profile_pic_url');
  });

  await knex.schema.createTable('posts', table => {
    table.increments();
    table.text('text');
    table.string('full_url');
    table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
    table.timestamps();
  });

  await knex.schema.createTable('comments', table => {
    table.increments();
    table.text('text');
    table.integer('user_id').references('id').inTable('users').notNullable().onDelete('cascade');
    table.integer('post_id').references('id').inTable('posts').notNullable().onDelete('cascade');
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('comments');

  await knex.schema.dropTable('posts');

  await knex.schema.table('users', table => {
    table.dropColumn('searchname_reverse');
    table.dropColumn('profile_pic_url');
  });
};
