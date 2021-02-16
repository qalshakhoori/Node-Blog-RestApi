const expect = require('chai').expect;
const express = require('express');
const mongoose = require('mongoose');
const { MONGODB_TEST_URI, TEST_USER_ID } = require('../utils/consts');
const User = require('../models/user');
const FeedController = require('../controllers/feed');

const { configureSockerIO } = require('../utils/helpers');

const app = express();
let server = app.listen(8080);
let io;
describe('Feed Controller', () => {
  before(function (done) {
    mongoose
      .connect(MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'test',
          posts: [],
          _id: TEST_USER_ID,
        });
        return user.save();
      })
      .then(() => {
        io = configureSockerIO(server);
        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        io.close();
        done();
      });
  });

  it('should add a created post to the posts of the creator', (done) => {
    const req = {
      body: {
        title: 'test post',
        content: 'A test content',
      },
      file: {
        path: 'abc',
      },
      userId: TEST_USER_ID,
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });
});
