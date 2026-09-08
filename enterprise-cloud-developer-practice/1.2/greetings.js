exports.handler = async function (event, context) {
    return {
        statusCode: 200,
        body : {
            message: `Hello ${event.queryStringParameters.first_name} ${event.queryStringParameters.last_name}!`
        }
    }
};