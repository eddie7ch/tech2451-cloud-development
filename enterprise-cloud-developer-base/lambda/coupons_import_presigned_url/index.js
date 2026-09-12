const AWS = require('aws-sdk');

const BUCKET_NAME = 'coupons';
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
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Invalid JSON body'}),
    };
  }

  if (!body.filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Missing required field: filename'}),
    };
  }

  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: BUCKET_NAME,
    Key: body.filename,
    Expires: EXPIRES_IN_SECONDS,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({url}),
  };
};
