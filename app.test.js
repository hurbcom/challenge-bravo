const test = require('tape');
const conversionCoins = require('./src/utils/conversCoins');
const supertest = require('supertest');
const app = require('./app');


test('Teste de conversão de moeda base', (t) => {
    const from = 'BRL';
    const to = 'EUR';

    const result = conversionCoins({ code: to, amount: 0.913 }, { code: from, amount: 4.86 }, 10);

    const expected = {
        status: 200, 
        data: {
            message: "BRL => EUR",
            value: "1.879"
        },
    };
    
    t.deepEqual(result, expected, 'Converção sucesso');
    t.end();
});

test('Testar conversão de valores (zero)', (t) => {
    const from = 'BRL';
    const to = 'EUR';
       
    const result = conversionCoins({ code: to, amount: 0.913 }, { code: from, amount: 4.86 }, 0);

    const expected = {
        status: 200, 
        data: {
            message: "BRL => EUR",
            value: 0
        },
    };
    
    t.deepEqual(result, expected, 'Retornado valor');
    t.end();
});

test('Testar conversão de valores (negativos)', (t) => {
    const from = 'BRL';
    const to = 'EUR';
       
    const result = conversionCoins({ code: to, amount: 0.913 }, { code: from, amount: 4.86 }, -10);

    const expected = {
        status: 200, 
        data: {
            message: "BRL => EUR",
            value: 0
        },
    };
    
    t.deepEqual(result, expected, 'Retornado valor');
    t.end();
});

test('GET /coins/:ENV/convert?from=MOEDA_ORIGEM&to=MOEDA_DESTINO&amount=VALOR_A_CONVERTER', (t) => {
    supertest(app)
      .get('/coins/test/convert?from=EDIESCB&to=BELLYONEPICE&amount=10')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) =>{
        t.error(err, 'Error:')
        t.assert(res.body.value === "4.286", "Success")
        t.end()  
      })
});

test('POST /coins/:ENV/insert', (t) => {
    const body = {
      code: "CHALLENGEBRAVO",
      name: "CHALLENGEBRAVO",
      value: "760.85"
    };
  
    supertest(app)
      .post('/coins/test/insert')  // Supondo que esta seja uma solicitação POST
      .send(body)                  // Inclui os dados no corpo da solicitação
      .set('Authorization', 'HURB-asfeEXamplevix027adsitba')  // Define o cabeçalho de Autorização
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        t.error(err, 'Erro:');
        t.assert(res.body.message === "Currency saved success", "Sucesso");
        t.end();
      });
  });

  test('PUT /coins/:ENV/update', (t) => {
    const body = {
      code: "CHALLENGEBRAVO",
      name: "CHALLENGEBRAVO-UPDATE",
      value: "5.685"
    };
  
    supertest(app)
      .put('/coins/test/update')  // Supondo que esta seja uma solicitação POST
      .send(body)                  // Inclui os dados no corpo da solicitação
      .set('Authorization', 'HURB-asfeEXamplevix027adsitba')  // Define o cabeçalho de Autorização
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        t.error(err, 'Erro:');
        t.assert(res.body.message === "Currency update success", "Sucesso");
        t.end();
      });
  });  

  test('DELETE /coins/:ENV/delete/:CODE', (t) => {
    const body = {
      code: "CHALLENGEBRAVO",
      name: "CHALLENGEBRAVO",
      value: "5.685"
    };
  
    supertest(app)
      .delete('/coins/test/delete/CHALLENGEBRAVO')  // Supondo que esta seja uma solicitação POST
      .send(body)                  // Inclui os dados no corpo da solicitação
      .set('Authorization', 'HURB-asfeEXamplevix027adsitba')  // Define o cabeçalho de Autorização
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        t.error(err, 'Erro:');
        t.assert(res.body.message === "Currency Deleted", "Sucesso");
        t.end();
      });
  });    
