const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

// The mock must exist before the module under test instantiates its
// DynamoDB.DocumentClient, since aws-sdk-mock patches at the class level.
// It's restored right after so each test below registers its own mock fresh.
AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('DynamoDB.DocumentClient', 'get');

describe('Coupon get by id', () => {

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'get');
  });

  test('Should return the coupon matching the id path parameter', async (done) => {

    const coupon = {coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', title: 'Save 20% on Fairmont hotels'};

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      expect(params.Key).toStrictEqual({coupon_id: coupon.coupon_id});
      callback(null, {Item: coupon});
    });

    const response = await handler({pathParameters: {id: coupon.coupon_id}}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual(coupon);

    done();
  });

  test('Should return 404 when the coupon does not exist', async (done) => {

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      callback(null, {});
    });

    const response = await handler({pathParameters: {id: 'does-not-exist'}}, null);

    expect(response.statusCode).toBe(404);

    done();
  });

  test('Should return 400 when the id path parameter is missing', async (done) => {

    const response = await handler({pathParameters: {}}, null);

    expect(response.statusCode).toBe(400);

    done();
  });
});
