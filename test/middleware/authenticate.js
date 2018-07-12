const request = require('supertest');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const authenticate = require('../../middleware/authenticate');

const { JWT_SECRET } = process.env;

describe('middleware/authenticate', () => {
  it('returns Forbidden error via next() if no token is provided', () => {
    const req = {
      get() {
        return null;
      }
    };
    const res = {};
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(next).to.have.been.calledWithMatch(sinon.match.instanceOf(createError.Forbidden));
  });

  it('returns Forbidden error via next() if authorization header is not a Bearer token', () => {
    const req = {
      get(key) {
        if (key === 'authorization') {
          return 'abcdefg1234567';
        }

        return null;
      }
    };
    const res = {};
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(next).to.have.been.calledWithMatch(sinon.match.instanceOf(createError.Forbidden));
  });

  it('returns Unauthorized error via next() if token vannot be verified', () => {
    const req = {
      get(key) {
        if (key === 'authorization') {
          return 'Bearer abcdefg1234567';
        }

        return null;
      }
    };
    const res = {};
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(next).to.have.been.calledWithMatch(sinon.match.instanceOf(createError.Unauthorized));
  });

  it('sets req.userId on verified token', () => {
    const token = jwt.sign({
      id: 1,
      username: 'John Doe'
    }, JWT_SECRET);

    const req = {
      get(key) {
        if (key === 'authorization') {
          return `Bearer ${token}`;
        }

        return null;
      }
    };
    const res = {};
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(req.userId).to.equal(1);
    expect(next).to.have.been.calledWith();
  });
});

// a group of tests to run for all routes that use this middleware
function authenticationTests(method, route) {
  it('returns 403 is no Authorization token present', async () => {
    await request(app)[method](route)
      .expect(403);
  });

  it('returns 401 is token cannot be decoded', async () => {
    await request(app)[method](route)
      .set('Authorization', 'Bearer abcdefg1234567')
      .expect(401);
  });
}

module.exports = authenticationTests;
