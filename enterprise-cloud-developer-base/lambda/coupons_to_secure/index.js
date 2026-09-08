const jwt = require('jsonwebtoken');

const JWT_SECRET = '0HXc4w5NEzA61HkV';

exports.handler = async function(event, context) {
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ?
    authHeader.slice('Bearer '.length) :
    authHeader;

  if (!token) {
    return forbidden();
  }

  try {
    jwt.verify(token, JWT_SECRET, {algorithms: ['HS256']});
  } catch (err) {
    return forbidden();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
    }),
  };
};

function getHeader(event, name) {
  const headers = event.headers || {};
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key ? headers[key] : undefined;
}

function forbidden() {
  return {
    statusCode: 403,
    body: JSON.stringify({message: 'Invalid or missing token'}),
  };
}
