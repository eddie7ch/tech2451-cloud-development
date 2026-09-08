const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: 'something',
  secretAccessKey: 'something',
  region:'us-east-1',
  logger: process.stdout
})

const docClient = new AWS.DynamoDB.DocumentClient({endpoint:'http://localhost:4566'});

exports.handler = async function (event, context) {
    // Update the lambda code to interact with *music* dynamodb table and fetch records. 
    // Dynamodb table has the following artist pick your favourite and fetch data of them 
    // Elvis Presley, Mariah Carey, Michael Jackson and Madonna
    data = { 
        'Artist': 'John Lennon',
        'SongTitle': 'Imagine'
    } 

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application-json',
            'Access-Control-Allow-Origin': '*'
        },
        body : {
            message: data
        }
    }
};