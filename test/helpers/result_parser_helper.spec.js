const chai = require('chai');

const expect = chai.expect;
const resultParserHelper = require('../../app/helpers/result_parser_helper');

describe('pass request and calculate result to result parser helper', () => {
  it('returns mounted object ', (done) => {
    const object = { from: 'USD', to: 'BRL', amount: '123' };
    const calculateResult = 200;
    const resultObject = {
      date: '2018-11-17',
      from: 'USD',
      to: 'BRL',
      amount: '123',
      converted: 200,
    };

    const result = resultParserHelper(object, calculateResult);

    expect(result).to.deep.equal(resultObject);
    done();
  });
});
