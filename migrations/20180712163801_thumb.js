exports.up = async knex => {
  await knex.schema.table('posts', table => {
    table.string('thumb_url');
    table.string('filename');
  });
};

exports.down = async knex => {
  await knex.schema.table('posts', table => {
    table.dropColumn('thumb_url');
    table.dropColumn('filename');
  });
};
