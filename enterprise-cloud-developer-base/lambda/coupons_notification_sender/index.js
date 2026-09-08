const AWS = require('aws-sdk');

AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});

const snsOptions = process.env.LOCALSTACK_HOSTNAME ?
  {endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`} :
  {};

const REGION = process.env.AWS_REGION || 'us-east-1';
const ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '000000000000';
const TOPIC_ARN = `arn:aws:sns:${REGION}:${ACCOUNT_ID}:coupons`;
const NOTIFICATION_MESSAGE = 'A new coupon is available';

const sns = new AWS.SNS(snsOptions);

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

  if (!body.coupon_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Missing required field: coupon_id'}),
    };
  }

  await sns.publish({
    TopicArn: TOPIC_ARN,
    Subject: `Coupon ${body.coupon_id}`,
    Message: NOTIFICATION_MESSAGE,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success'}),
  };
};
