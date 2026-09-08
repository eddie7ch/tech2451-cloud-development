const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: 'something',
  secretAccessKey: 'something',
  region:'us-east-1',
  logger: process.stdout
})

const docClient = new AWS.DynamoDB.DocumentClient({endpoint:'http://localhost:4566'});

exports.handler = async function (event, context) {
    // Dynamodb contact table has contact_id 0001 to 0015. Get contact_id from request params
    // and use phone_number provided in the payload to update the dynamodb table. Return statusCode and message to follow the apigateway
    // contract https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html.
}