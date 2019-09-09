const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../../index')


chai.use(chaiHttp);
chai.should();

// Nossa suite de teste relacionada a Quotations
describe('Quotations', () => {
  
  // 
  describe('/GET Quotation', () => {
        it('Testando GET de Quotations', (done) => {
            chai.request(app)
                .get('/quotation/?from=bra&to=cub&amount=10')   // É necessário ter uma moeda real cadastrada
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                  done();
                });
        });
    });
  
  // Teste para inserir a moeda
  describe('/POST Currency', () => {
        it('Verificar o cadastro de Currency', (done) => {
            let currency = { // Vamos defnir o currency que vamos inserir
              name: "eua",
              com: "2.3",
              tur: "1",
              par: "40"
            }
              chai.request(app)
              .post('/insertcoin')
              .send(currency) // vamos enviar esse arquivo
              .end((err, res) => {
                  res.should.have.status(200);
                done();
              });
        });

    });
  
  // Teste para deletar a Moeda
  describe('/DELETE/:id Currency', () => {
        it('DELETE em Currency por ID', (done) => {
            let id_ = "5d757ad53636da0b9447d28c"; // É necessária um id real para funcionar
              chai.request(app)
              .delete(`/clear/` + id_)
              .end((err, res) => {
                  res.should.have.status(200);
                done();
              });
  
        });
    });
  
})