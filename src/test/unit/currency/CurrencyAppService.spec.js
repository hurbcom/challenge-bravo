const CurrencyAppService = require("../../../api/currency/application/impl/CurrencyAppService")

const { expect } = require('chai')
const sinon = require('sinon')
const httpMocks = require('node-mocks-http');

describe('Currency -> Application -> Impl -> CurrencyAppService', () => {
    describe('Success path', () => {
        let MockRepository, responseMock, currencyFactoryMock, currencyAppService,
            res, req, nextSpy
        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            nextSpy = sinon.spy();

            MockRepository = {
                getAll: () => [{ id: 1, abbreviation: 'BRL' }],
                add: (entity) => 1,
                remove: (id) => id
            }

            responseMock = ({
                Success: (data) => ({ data: data }),
                Fail: (data) => ({ data: data })
            })

            currencyFactoryMock = (abbreviation) => ({ abbreviation })

            currencyAppService = CurrencyAppService({
                response: responseMock,
                currencyRepository: MockRepository,
                currencyFactory: currencyFactoryMock
            })
        })

        describe('GET', () => {
            it('should be a function', () => {
                expect(currencyAppService.get).to.be.a('function')
            })

            it('should accept three arguments', function () {
                expect(currencyAppService.get.length).to.equal(3);
            });

            it('should return 200 OK', done => {
                currencyAppService.get(req, res, nextSpy)
                    .then(() => {
                        expect(res.statusCode).to.equal(200)
                        done()
                    }).catch(err => done(err))
            })
        })

        describe('POST', () => {
            it('should be a function', () => {
                expect(currencyAppService.post).to.be.a('function')
            })

            it('should accept four arguments', function () {
                expect(currencyAppService.post.length).to.equal(4);
            });

            it('should return 200 OK', done => {
                const data = { abbreviation: 'BRL' }
                currencyAppService.post(req, res, nextSpy, data)
                    .then(() => {
                        expect(res.statusCode).to.equal(200)
                        done()
                    }).catch(err => done(err))
            })
        })

        describe('DELETE', () => {
            it('should be a function', () => {
                expect(currencyAppService.del).to.be.a('function')
            })

            it('should accept four arguments', function () {
                expect(currencyAppService.del.length).to.equal(4);
            });

            it('should return 200 OK', done => {
                const data = 1
                currencyAppService.del(req, res, nextSpy, data)
                    .then(() => {
                        expect(res.statusCode).to.equal(200)
                        done()
                    }).catch(err => done(err))
            })
        })
    })

    describe('Fail path', () => {
        let MockRepository, responseMock, currencyFactoryMock, currencyAppServiceMockError,
            MockRepositoryError, currencyFactoryMockError, currencyAppServiceFactoryError,
            res, req, nextSpy
        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            nextSpy = sinon.spy();

            MockRepositoryError = {
                getAll: () => { throw new Error('test error') },
                add: (entity) => { throw new Error('test error') },
                remove: (id) => { throw new Error('test error') }
            }

            MockRepositoryErrorNotFound = {
                ...MockRepositoryError,
                remove: (id) => 0
            }

            MockRepository = {
                getAll: () => [{ id: 1, abbreviation: 'BRL' }],
                add: (entity) => 1
            }

            responseMock = ({
                Success: (data) => ({ data: data }),
                Fail: (data) => ({ data: data })
            })

            currencyFactoryMock = (abbreviation) => ({ abbreviation })

            currencyFactoryMockError = (abbreviation) => { throw new Error('test error') }


            currencyAppServiceWithRepositoryError = CurrencyAppService({
                response: responseMock,
                currencyRepository: MockRepositoryError,
                currencyFactory: currencyFactoryMock
            })

            currencyAppServiceWithRepositoryErrorNotFound = CurrencyAppService({
                response: responseMock,
                currencyRepository: MockRepositoryErrorNotFound,
                currencyFactory: currencyFactoryMock
            })

            currencyAppServiceWithFactoryError = CurrencyAppService({
                response: responseMock,
                currencyRepository: MockRepository,
                currencyFactory: currencyFactoryMockError
            })
        })

        describe('GET', () => {
            it('should throw exception when getAll has error', (done) => {
                currencyAppServiceWithRepositoryError.get()
                    .catch(error => {
                        // kind of workaround, chai has no real solution for this
                        expect(error).to.be.an('Error').with.property('message', 'test error')
                        done()
                    })
            })
        })

        describe('POST', () => {
            it('should throw exception when add has error', (done) => {
                currencyAppServiceWithRepositoryError.post(req, res, nextSpy, { abbreviation: 'BRL' })
                    .catch(error => {
                        // kind of workaround, chai has no real solution for this
                        expect(error).to.be.an('Error').with.property('message', 'test error')
                        done()
                    })
            })

            it('should throw exception when currencyFactory has error', (done) => {
                currencyAppServiceWithFactoryError.post(req, res, nextSpy, { id: 1, abbreviation: 'BRL' })
                    .catch(error => {
                        // kind of workaround, chai has no real solution for this
                        expect(error).to.be.an('Error').with.property('message', 'test error')
                        done()
                    })
            })
        })

        describe('DELETE', () => {
            it('should throw exception when remove has error', (done) => {
                currencyAppServiceWithRepositoryError.del(req, res, nextSpy, 1)
                    .catch(error => {
                        // kind of workaround, chai has no real solution for this
                        expect(error).to.be.an('Error').with.property('message', 'test error')
                        done()
                    })
            })

            it('should return 404 when item not found', (done) => {
                currencyAppServiceWithRepositoryErrorNotFound.del(req, res, nextSpy, 1)
                    .then(e => {
                        // kind of workaround, chai has no real solution for this
                        expect(res.statusCode).to.equal(404)
                        done()
                    })
            })
        })
    })
})