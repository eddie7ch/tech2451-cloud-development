const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

AWSMock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('DynamoDB.DocumentClient', 'update');

describe('Coupon update', () => {

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'update');
  });

  test('Should update the coupon fields given in the body and return the new item', async (done) => {

    const updated = {coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', title: 'Save 30% on Fairmont hotels'};

    AWSMock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
      expect(params.Key).toStrictEqual({coupon_id: updated.coupon_id});
      expect(params.ExpressionAttributeValues[':v0']).toBe('Save 30% on Fairmont hotels');
      callback(null, {Attributes: updated});
    });

    const response = await handler({
      pathParameters: {id: updated.coupon_id},
      body: JSON.stringify({title: 'Save 30% on Fairmont hotels'}),
    }, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual(updated);

    done();
  });

  test('Should return 400 when the id path parameter is missing', async (done) => {

    const response = await handler({pathParameters: {}, body: '{}'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });

  test('Should return 400 when the body has no updatable fields', async (done) => {

    const response = await handler({pathParameters: {id: 'abc'}, body: '{}'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });

  test('Should return 400 when the body is invalid JSON', async (done) => {

    const response = await handler({pathParameters: {id: 'abc'}, body: 'not json'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });
});
