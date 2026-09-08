const {handler} = require('../index.js');

describe('Coupon list', () => {

  test('Should return success message', async (done) => {

    const expectedResponse = {message: 'Coupons API is working successfully'};

    const response = await handler({}, null);
    const responseParsed = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(responseParsed).toStrictEqual(expectedResponse);

    done();
  });
});
