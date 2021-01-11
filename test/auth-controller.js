const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', () => {
  it('should throw an error if accessing database failed', () => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    expect(AuthController.login);

    User.findOne.restore();
  });
});
