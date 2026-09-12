const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

AWSMock.mock('S3', 'getSignedUrl', (operation, params, callback) => callback(null, 'https://example.com/signed'));

const {handler} = require('../index.js');

AWSMock.restore('S3', 'getSignedUrl');

describe('Coupon import presigned url', () => {

  afterEach(() => {
    AWSMock.restore('S3', 'getSignedUrl');
  });

  test('Should return a presigned PUT URL for the requested filename in the coupons bucket', async (done) => {

    const filename = '319326de971100158f6fa0daeec978fba1f17e4b.json';

    AWSMock.mock('S3', 'getSignedUrl', (operation, params, callback) => {
      expect(operation).toBe('putObject');
      expect(params.Bucket).toBe('coupons');
      expect(params.Key).toBe(filename);
      callback(null, `https://coupons.s3.localhost.localstack.cloud:4566/${filename}?X-Amz-Signature=abc`);
    });

    const response = await handler({body: JSON.stringify({filename})}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed.url).toContain(filename);

    done();
  });

  test('Should return 400 when filename is missing', async (done) => {

    const response = await handler({body: JSON.stringify({})}, null);

    expect(response.statusCode).toBe(400);

    done();
  });

  test('Should return 400 when the body is invalid JSON', async (done) => {

    const response = await handler({body: 'not json'}, null);

    expect(response.statusCode).toBe(400);

    done();
  });
});
