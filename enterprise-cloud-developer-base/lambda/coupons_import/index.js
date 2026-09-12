const AWS = require('aws-sdk');

const BUCKET_NAME = 'coupons';

const s3Options = process.env.LOCALSTACK_HOSTNAME ?
  {
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
    s3ForcePathStyle: true,
  } :
  {};

const s3 = new AWS.S3(s3Options);

exports.handler = async function(event, context) {
  let coupon;
  try {
    coupon = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Invalid JSON body'}),
    };
  }

  if (!coupon.coupon_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Missing required field: coupon_id'}),
    };
  }

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: `${coupon.coupon_id}.json`,
    Body: JSON.stringify(coupon),
    ContentType: 'application/json',
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success'}),
  };
};
