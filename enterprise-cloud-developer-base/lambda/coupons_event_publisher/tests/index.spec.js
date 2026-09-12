const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

AWSMock.mock('Kinesis', 'putRecord', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('Kinesis', 'putRecord');

describe('Coupon event publisher', () => {

  afterEach(() => {
    AWSMock.restore('Kinesis', 'putRecord');
  });

  test('Should publish the coupon to the Kinesis stream', async (done) => {

    const coupon = {coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', title: 'Save 20% on Fairmont hotels'};

    AWSMock.mock('Kinesis', 'putRecord', (params, callback) => {
      expect(params.StreamName).toBe('coupons');
      expect(params.PartitionKey).toBe(coupon.coupon_id);
      expect(JSON.parse(params.Data)).toStrictEqual(coupon);
      callback(null, {ShardId: 'shard-1', SequenceNumber: '1'});
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
