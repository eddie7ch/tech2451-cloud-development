const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

// The mock must exist before the module under test instantiates its S3
// client, since aws-sdk-mock patches at the class level. It's restored
// right after so each test below registers its own mock fresh.
AWSMock.mock('S3', 'getSignedUrl', (operation, params, callback) => callback(null, 'https://example.com/signed'));

const {handler} = require('../index.js');

AWSMock.restore('S3', 'getSignedUrl');

describe('Coupon import presigned url', () => {

  afterEach(() => {
    AWSMock.restore('S3', 'getSignedUrl');
  });

  test('Should return a presigned PUT URL for coupon.json in the coupons bucket', async (done) => {

    AWSMock.mock('S3', 'getSignedUrl', (operation, params, callback) => {
      expect(operation).toBe('putObject');
      expect(params.Bucket).toBe('coupons');
      expect(params.Key).toBe('coupon.json');
      callback(null, 'https://coupons.s3.localhost.localstack.cloud:4566/coupon.json?X-Amz-Signature=abc');
    });

    const response = await handler({}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed.url).toContain('coupon.json');

    done();
  });
});
