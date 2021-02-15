const expect = require('chai').expect;
const sinon = require('sinon');

const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth');

describe('auth middleware', () => {
  it('should through an error if no authroization header is present', function () {
    const req = {
      get: function () {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if authorization header is only string.', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', () => {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a user if after decoding the token', () => {
    const req = {
      get: function (headerName) {
        return 'Bearer abd';
      },
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });

    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    jwt.verify.restore();
  });
});
