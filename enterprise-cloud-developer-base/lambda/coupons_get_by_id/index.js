const AWS = require('aws-sdk');

AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});

const dynamoDbOptions = process.env.LOCALSTACK_HOSTNAME ?
  {endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`} :
  {};

const TABLE_NAME = 'coupons';

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbOptions);

exports.handler = async function(event, context) {
  const id = event.pathParameters && event.pathParameters.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Missing required path parameter: id'}),
    };
  }

  const result = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {coupon_id: id},
  }).promise();

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({message: `Coupon not found: ${id}`}),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};
