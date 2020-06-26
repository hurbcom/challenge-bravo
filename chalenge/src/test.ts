import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from './index';

chai.use(chaiHttp);
chai.should();

describe("Currency Tests", () => {

  describe("GET /", () => {
    it("Enviando requisição sem parametros", (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          chai.expect(Object.keys(res.body).length).to.equal(0);
          chai.expect(res.text).to.equal('Unprocessable Entity')
          done();
        });
    });

    it("Enviando requisição USD to BRL 5.35 * 2", (done) => {
      chai.request(app)
        .get('/?from=USD&to=BRL&amount=2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.expect(Object.keys(res.body).length).to.equal(4);
          chai.expect(res.body.ok).to.equal(true);
          chai.expect(res.body.from).to.equal('USD');
          chai.expect(res.body.to).to.equal('BRL');
          chai.expect(res.body.amount).to.equal('10.70');
          done();
        });
    });

    it("Enviando insercao de moeda name ASD value 90", (done) => {
      const id = 1;
      chai.request(app)
        .post(`/create?name=ASD&value=90`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it("Teste Insercao de moeda e conversao da moeda", (done) => {
      chai.request(app)
        .post(`/create?name=AWA&value=9`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.request(app)
            .get('/?from=USD&to=AWA&amount=10')
            .end((err, res) => {
              chai.expect(res.body.ok).to.equal(true);
              chai.expect(res.body.from).to.equal('USD');
              chai.expect(res.body.to).to.equal('AWA');
              chai.expect(res.body.amount).to.equal('90.00');
            })
          done();
        });
    });

    it("Enviando url inexistente", (done) => {
      chai.request(app)
        .get(`/url_inexistente`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

});