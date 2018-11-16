const chai = require('chai');

const expect = chai.expect;
const validateHelper = require('../../app/helpers/validate_helper');

describe('pass all required parameters to validate', () => {
  it('returns true', (done) => {
    const object = { from: 'USD', to: 'BRL', amount: 2 };
    const validate = validateHelper(object);

    expect(validate).to.be.equal(true);
    done();
  });
});
