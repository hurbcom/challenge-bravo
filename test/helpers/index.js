require('rootpath')()

const setUpTest = () => {
    process.env.NODE_ENV = 'test'
    const nock = require('nock')
    const chai = require('chai')
    const sinon = require('sinon')
    const sinonChai = require('sinon-chai')
    const chaiAsPromised = require('chai-as-promised')
    let chaiHttp = require('chai-http');

    chai.use(chaiHttp);

    chai.use(chaiAsPromised)
    chai.use(sinonChai)
    chai.should()

    global.expect = chai.expect
    global.assert = chai.assert
    global.sinon = sinon
    global.nock = nock
}

module.exports = setUpTest