const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('DynamoDB.DocumentClient', 'put');

describe('Coupon import', () => {

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'put');
  });

  test('Should store the uploaded coupon in DynamoDB', async (done) => {

    const coupon = {coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', title: 'Save 20% on Fairmont hotels'};

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      expect(params.TableName).toBe('coupons');
      expect(params.Item).toStrictEqual(coupon);
      callback(null, {});
    });

    const response = await handler({body: JSON.stringify(coupon)}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual({status: 'success'});

    done();
  });

  test('Should return 400 when coupon_id is missing', async (done) => {

    const response = await handler({body: JSON.stringify({title: 'no id'})}, null);

    expect(response.statusCode).toBe(400);

    done();
  });

  test('Should return 400 when the body is invalid JSON', async (done) => {

    const response = await handler({body: 'not json'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });
});
