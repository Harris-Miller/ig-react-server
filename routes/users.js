const express = require('express');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/user');
const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');

const userSchema = graphql.buildSchema(`
  type Query {
    user(id: Int!): User
    users: [User]
  },
  type Mutation {
    updateUser(id: Int!, displayname: String, email: String, profilePicUrl: String): User
  },
  type User {
    id: Int
    displayname: String
    email: String
    profilePicUrl: String
    createdAt: String
    updatedAt: String,
    posts: [Post]
  },
  type Post {
    id: Int
    userId: Int
    text: String
    fullUrl: String
  }
`);

function getUser({ id }) {
  return User
    .query({ where: { id }})
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
    .then(users => {
      return users.toJSON();
    });
}

function updateUser({ id, displayname, email, profilePicUrl }) {
  console.log('in updateUser', id, displayname, email, profilePicUrl);

  const saveObj = {};
  id && (saveObj['id'] = id);
  displayname && (saveObj['displayname'] = displayname);
  email && (saveObj['email'] = email);
  profilePicUrl && (saveObj['profile_pic_url'] = profilePicUrl);

  return User
    .query({ where: { id }})
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
  graphiql: true
});
