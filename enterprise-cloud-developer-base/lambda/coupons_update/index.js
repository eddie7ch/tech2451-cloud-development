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

  let updates;
  try {
    updates = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Invalid JSON body'}),
    };
  }

  const fields = Object.keys(updates).filter((key) => key !== 'coupon_id');

  if (fields.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'No updatable fields provided in body'}),
    };
  }

  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const setClauses = fields.map((field, i) => {
    expressionAttributeNames[`#f${i}`] = field;
    expressionAttributeValues[`:v${i}`] = updates[field];
    return `#f${i} = :v${i}`;
  });

  const result = await dynamoDb.update({
    TableName: TABLE_NAME,
    Key: {coupon_id: id},
    UpdateExpression: `SET ${setClauses.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};
