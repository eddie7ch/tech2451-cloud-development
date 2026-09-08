const AWS = require('aws-sdk');

AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});

const dynamoDbOptions = process.env.LOCALSTACK_HOSTNAME ?
  {endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`} :
  {};

const TABLE_NAME = 'coupons';

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbOptions);

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

  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: coupon,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success'}),
  };
};
