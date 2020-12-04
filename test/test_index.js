// Executa os dois testes em sequência. Atenção: os testes irão apagar todo o conteúdo do BD

/* O teste de API chama o index.js da aplicação e mantém a conexão aberta com localhost, e também
  com o BD, para o teste do BD ser executado em seguida */

describe('Executando testes...', () => {
    require('./testcases/api_test');
    require('./testcases/db_test');
});