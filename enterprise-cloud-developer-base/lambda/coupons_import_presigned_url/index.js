const AWS = require('aws-sdk');

const BUCKET_NAME = 'coupons';
const OBJECT_KEY = 'coupon.json';
const EXPIRES_IN_SECONDS = 300;

// use a host the client can actually reach, not LOCALSTACK_HOSTNAME
const s3Options = process.env.LOCALSTACK_HOSTNAME ?
  {
    endpoint: process.env.S3_PUBLIC_ENDPOINT || 'http://localhost:4566',
    s3ForcePathStyle: true,
  } :
  {};

const s3 = new AWS.S3(s3Options);

exports.handler = async function(event, context) {
  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: BUCKET_NAME,
    Key: OBJECT_KEY,
    Expires: EXPIRES_IN_SECONDS,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({url}),
  };
};
