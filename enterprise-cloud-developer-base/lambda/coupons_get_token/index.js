const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

AWS.config.update({region: process.env.AWS_REGION || 'us-east-1'});

const dynamoDbOptions = process.env.LOCALSTACK_HOSTNAME ?
  {endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`} :
  {};

const TABLE_NAME = 'users';
const JWT_SECRET = '0HXc4w5NEzA61HkV';
const EXPIRES_IN_SECONDS = 3600;

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbOptions);

exports.handler = async function(event, context) {
  let credentials;
  try {
    credentials = JSON.parse(event.body || '{}');
  } catch (err) {
    return forbidden();
  }

  const {username, password} = credentials;

  if (!username || !password) {
    return forbidden();
  }

  const result = await dynamoDb.get({
    TableName: TABLE_NAME,
    Key: {username},
  }).promise();

  if (!result.Item) {
    return forbidden();
  }

  const passwordMatches = await bcrypt.compare(password, result.Item.password);

  if (!passwordMatches) {
    return forbidden();
  }

  const token = jwt.sign({sub: username}, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: EXPIRES_IN_SECONDS,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
      expiresIn: EXPIRES_IN_SECONDS,
    }),
  };
};

function forbidden() {
  return {
    statusCode: 403,
    body: JSON.stringify({message: 'Invalid username or password'}),
  };
}
