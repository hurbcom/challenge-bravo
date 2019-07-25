<p align="center">
  <img src="/images/app.png" width="700" height="340" alt="App" /></a>
</p>








# Descrição

A API faz busca em diferentes fontes na internet

realiza calculos dos valores das moedas de diversos países

além de crypto coins, o valor é baseado no Dollar Americano por padrão


Os dados exibidos são originados nas API's:

https://exchangeratesapi.io
para moedas

https://alternative.me
para crypto moedas


# Instalação das dependências
```bash
$ npm install
```

# Iniciando a aplicação em modo de desenvolvimento

# development
```bash
$ npm run start
```
# ou watch mode
```bash
$ npm run start:dev
```

# Executando a aplicação em modo de produção
```bash
$ npm run start:prod
```

# Execução de testes unitários
```bash
$ npm run test
```
# Cobertura de testes
```bash
$ npm run test:cov
```

# Especificações
 A aplicação foi desenvolvida com NestJs como Framework para Node.js
utilizando a linguagem TypeScript.
a interface web foi desenvovida como SPA utilizando VueJs

Link para visualização dos endpoints no swagger
http://127.0.0.1:3000/api/

Documentação:
execute o comando:
```bash
$ npm start:doc:server
```
link para a documentação: http://127.0.0.1:3010
