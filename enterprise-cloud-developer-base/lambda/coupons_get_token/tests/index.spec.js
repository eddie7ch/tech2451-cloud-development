const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

AWSMock.setSDKInstance(AWS);

// The mock must exist before the module under test instantiates its
// DynamoDB.DocumentClient, since aws-sdk-mock patches at the class level.
// It's restored right after so each test below registers its own mock fresh.
AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('DynamoDB.DocumentClient', 'get');

const JWT_SECRET = '0HXc4w5NEzA61HkV';

describe('Coupon get token', () => {

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'get');
  });

  test('Should return a token and expiresIn when credentials are valid', async (done) => {

    const passwordHash = bcrypt.hashSync('correct-password', 12);

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      expect(params.Key).toStrictEqual({username: 'tester1'});
      callback(null, {Item: {username: 'tester1', password: passwordHash}});
    });

    const response = await handler({
      body: JSON.stringify({username: 'tester1', password: 'correct-password'}),
    }, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed.expiresIn).toBe(3600);
    const decoded = jwt.verify(responseParsed.token, JWT_SECRET);
    expect(decoded.sub).toBe('tester1');

    done();
  });

  test('Should return 403 when the password is wrong', async (done) => {

    const passwordHash = bcrypt.hashSync('correct-password', 12);

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {Item: {username: 'tester1', password: passwordHash}});
    });

    const response = await handler({
      body: JSON.stringify({username: 'tester1', password: 'wrong-password'}),
    }, null);

    expect(response.statusCode).toBe(403);

    done();
  });

  test('Should return 403 when the username does not exist', async (done) => {

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {});
    });

    const response = await handler({
      body: JSON.stringify({username: 'no-such-user', password: 'whatever'}),
    }, null);

    expect(response.statusCode).toBe(403);

    done();
  });

  test('Should return 403 when username or password are missing', async (done) => {

    const response = await handler({body: JSON.stringify({username: 'tester1'})}, null);

    expect(response.statusCode).toBe(403);

    done();
  });
});
