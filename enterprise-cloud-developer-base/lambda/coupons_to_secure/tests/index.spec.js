const jwt = require('jsonwebtoken');
const {handler} = require('../index.js');

const JWT_SECRET = '0HXc4w5NEzA61HkV';

describe('Coupon to secure', () => {

  test('Should return success when a valid token is provided', async (done) => {

    const token = jwt.sign({sub: 'tester1'}, JWT_SECRET, {algorithm: 'HS256', expiresIn: 3600});

    const response = await handler({
      headers: {Authorization: `Bearer ${token}`},
    }, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual({status: 'success'});

    done();
  });

  test('Should return 403 when the token is invalid', async (done) => {

    const response = await handler({
      headers: {Authorization: 'Bearer not-a-real-token'},
    }, null);

    expect(response.statusCode).toBe(403);

    done();
  });

  test('Should return 403 when the token is expired', async (done) => {

    const expiredToken = jwt.sign({sub: 'tester1'}, JWT_SECRET, {algorithm: 'HS256', expiresIn: -10});

    const response = await handler({
      headers: {Authorization: `Bearer ${expiredToken}`},
    }, null);

    expect(response.statusCode).toBe(403);

    done();
  });

  test('Should return 403 when no Authorization header is provided', async (done) => {

    const response = await handler({headers: {}}, null);

    expect(response.statusCode).toBe(403);

    done();
  });
});
