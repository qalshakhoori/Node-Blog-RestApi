const expect = require('chai').expect;
const authMiddleware = require('../middleware/is-auth');

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
