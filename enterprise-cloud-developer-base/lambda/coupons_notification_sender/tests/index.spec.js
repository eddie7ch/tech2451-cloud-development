const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

// The mock must exist before the module under test instantiates its SNS
// client, since aws-sdk-mock patches at the class level. It's restored
// right after so each test below registers its own mock fresh.
AWSMock.mock('SNS', 'publish', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('SNS', 'publish');

describe('Coupon notification sender', () => {

  afterEach(() => {
    AWSMock.restore('SNS', 'publish');
  });

  test('Should publish the fixed notification message to the coupons topic', async (done) => {

    AWSMock.mock('SNS', 'publish', (params, callback) => {
      expect(params.TopicArn).toContain(':coupons');
      expect(params.Message).toBe('A new coupon is available');
      callback(null, {MessageId: 'abc'});
    });

    const response = await handler({
      body: JSON.stringify({coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', message: 'ignored - the fixed message is always sent'}),
    }, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual({status: 'success'});

    done();
  });

  test('Should return 400 when coupon_id is missing', async (done) => {

    const response = await handler({body: JSON.stringify({message: 'hi'})}, null);

    expect(response.statusCode).toBe(400);

    done();
  });

  test('Should return 400 when the body is invalid JSON', async (done) => {

    const response = await handler({body: 'not json'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });
});
