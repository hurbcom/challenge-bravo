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

describe('do not pass right parameters', () => {
  it('returns false', (done) => {
    const object = { from: 'AAA', to: 'BRL', amount: 2 };
    const validate = validateHelper(object);

    expect(validate).to.be.equal(false);
    done();
  });
});

describe('do not pass one parameter', () => {
  it('returns false', (done) => {
    const object = { from: 'USD', to: 'BRL' };
    const validate = validateHelper(object);

    expect(validate).to.be.equal(false);
    done();
  });
});
