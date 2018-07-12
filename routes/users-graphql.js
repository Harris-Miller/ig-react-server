const createError = require('http-errors');
const User = require('../models/user');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const userSchema = buildSchema(`
  type Query {
    user(id: ID!): User
    users: [User]
  },
  type Mutation {
    updateUser(id: ID!, displayname: String, email: String, profilePicUrl: String): User
  },
  type User {
    id: ID
    displayname: String
    email: String
    profilePicUrl: String
    searchname: String
    searchnameReverse: String
    createdAt: String
    updatedAt: String,
    posts: [Post]
  },
  type Post {
    id: ID
    userId: ID
    text: String
    fullUrl: String
  }
`);

function getUser({ id }) {
  return User
    .query({ where: { id } })
    .fetch({ withRelated: 'posts' })
    .then(user => {
      if (!user) {
        return new createError.NotFound();
      }

      return user.toJSON();
    });
}

function getUsers() {
  return User
    .fetchAll({ withRelated: 'posts' })
    .then(users => users.toJSON());
}

function updateUser({ id, displayname, email, profilePicUrl }) {
  const saveObj = {};
  id && (saveObj.id = id);
  displayname && (saveObj.displayname = displayname);
  email && (saveObj.email = email);
  profilePicUrl && (saveObj.profile_pic_url = profilePicUrl);

  return User
    .query({ where: { id } })
    .fetch()
    .then(user => {
      if (!user) {
        return new createError.NotFound();
      }

      return user.save(saveObj, { patch: true });
    }).then(user =>
      user.toJSON()
    );
}

const root = {
  user: getUser,
  users: getUsers,
  updateUser
};

module.exports = graphqlHTTP({
  schema: userSchema,
  rootValue: root,
  graphiql: process.env.NODE_ENV === 'development'
});
