const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

AWSMock.mock('S3', 'putObject', (params, callback) => {
  callback(null, {});
});

const {handler} = require('../index.js');

AWSMock.restore('S3', 'putObject');

describe('Coupon import', () => {

  afterEach(() => {
    AWSMock.restore('S3', 'putObject');
  });

  test('Should store the uploaded coupon as a JSON file in the bucket', async (done) => {

    const coupon = {coupon_id: '319326de971100158f6fa0daeec978fba1f17e4b', title: 'Save 20% on Fairmont hotels'};

    AWSMock.mock('S3', 'putObject', (params, callback) => {
      expect(params.Bucket).toBe('coupons');
      expect(params.Key).toBe(`${coupon.coupon_id}.json`);
      expect(JSON.parse(params.Body)).toStrictEqual(coupon);
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
