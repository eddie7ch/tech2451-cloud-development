const jwt = require('jsonwebtoken');

exports.handler = async function (event, context) {
    const jwtSecretKey =  process.env.JWT_TOKEN;
  
    const data = {
        date: new Date().toISOString()
    }

    const token = jwt.sign(data, jwtSecretKey);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application-json',
            'Access-Control-Allow-Origin': '*'
        },
        body : {
            token: token
        }
    }
}