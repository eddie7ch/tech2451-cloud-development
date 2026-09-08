const { handler } = require('../index.js');

describe('Coupon update', () => {

  test('Should return success status', async (done) => {

    const expectedResponse = { status: 'success' };

    const response = await handler({}, null);
    const responseParsed = JSON.parse(response.body);

    expect(responseParsed).toStrictEqual(expectedResponse);

    done();
  });
});