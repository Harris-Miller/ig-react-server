exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { id: 1, displayname: 'Harris Miller', searchname: 'harris miller', searchname_reverse: 'miller harris', email: 'djharrismiller@gmail.com', password_digest: '$2b$10$WTbTEDngLSNto7umhZEwU.Ie/dtQzb7CwxWmA//zQ.swhQsYERb7O', created_at: '2018-07-10 05:01:23.362-06', updated_at: '2018-07-10 05:01:23.362-06', profile_pic_url: 'https://scontent.fapa1-1.fna.fbcdn.net/v/t31.0-8/20626674_10101201817056009_7911095644089910964_o.jpg?_nc_cat=0&oh=845a0158cd57d5cd47017a07469bf1e9&oe=5BD877A0' },
        { id: 2, displayname: 'Bill Murray', searchname: 'bill murray', searchname_reverse: 'murray bill', email: 'bill.murray@gmail.com', password_digest: '$2b$10$WTbTEDngLSNto7umhZEwU.Ie/dtQzb7CwxWmA//zQ.swhQsYERb7O', created_at: '2018-07-10 05:01:23.362-06', updated_at: '2018-07-10 05:01:23.362-06', profile_pic_url: 'https://www.fillmurray.com/500/500' },
        { id: 3, displayname: 'Nick Cage', searchname: 'nick cage', searchname_reverse: 'cage nick', email: 'nick.cage@gmail.com', password_digest: '$2b$10$WTbTEDngLSNto7umhZEwU.Ie/dtQzb7CwxWmA//zQ.swhQsYERb7O', created_at: '2018-07-10 05:01:23.362-06', updated_at: '2018-07-10 05:01:23.362-06', profile_pic_url: 'http://www.placecage.com/c/500/500' },
        { id: 4, displayname: 'Kitty', searchname: 'kitty', searchname_reverse: 'kitty', email: 'kitty@gmail.com', password_digest: '$2b$10$WTbTEDngLSNto7umhZEwU.Ie/dtQzb7CwxWmA//zQ.swhQsYERb7O', created_at: '2018-07-10 05:01:23.362-06', updated_at: '2018-07-10 05:01:23.362-06', profile_pic_url: 'https://placekitten.com/300/300' }
      ]);
    });

  await knex('posts').del()
    .then(function () {
      return knex('posts').insert([
        { id: 1, user_id: 1, text: 'This is my first post!', full_url: 'http://blog.sillyme.me/wp-content/uploads/2012/10/first-post.jpg', created_at: '2018-07-10 05:01:23.362-06', updated_at: '2018-07-10 05:01:23.362-06' }
      ]);
    });
};
