const AWS = require('aws-sdk');

AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});

const kinesisOptions = process.env.LOCALSTACK_HOSTNAME ?
  {endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`} :
  {};

const STREAM_NAME = 'coupons';

const kinesis = new AWS.Kinesis(kinesisOptions);

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

  await kinesis.putRecord({
    StreamName: STREAM_NAME,
    PartitionKey: coupon.coupon_id,
    Data: JSON.stringify(coupon),
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success'}),
  };
};
