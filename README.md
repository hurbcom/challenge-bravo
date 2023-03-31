Aplicação desenvolvida para o desafio Bravo da HURB.

- libs utilizadas: 
 - chamadas HTTP/Endpoints
    - axios
 - testes unitarios 
    - mocha
    - mock-require
    - expect.js
    - nyc
- validações
    - express-jsonschema
- documentação
    - swagger-autogen
    - swagger-ui-express
- frameworks
    - TypeScript
    - ExpressJs
    
 

1 - Api de conversão monetária espera receber 3 parametros em uma requisição POST, os parametros são "from", "to" e "amount" onde "from" é o código da moeda de origem, "to" é o código da moeda de destino da conversão e "amount" é a quantidade a ser convertida
    a - a api do desafio utiliza a api externa awesomeapi para busca dos dados de cotação para moedas reais.
    b - utilizei um sistema de cache local usando arquivos json para criar caches com validade de 1 hora. Em uma aplicação real eu utilizaria um servidor redis ou memcache para guardar as informações temporariamente e poupar tempo de requisição e consumo de api externa no processo. para o desafio, achei melhor utilizar algo em arquivo mesmo para poupar tempo.
    
2 - A api apresenta validação de requisição utilizando json schema, como a api é bastante simples e a cobertura do json schema já supre a necessidade de segurança para os cenarios propostos, não inclui uma biblioteca para validação de XSS(cross-site scripting) mas em uma aplicação real ela estaria presente e o desenvolvimento seria feito usando a metodologia de Security by design;

3 - Api de cadastro de novas moedas espera receber 3 parametros porém apenas dois deles são obrigatórios, são eles "currency" que é o codigo para a nova moeda (codigo deve possuir entre 3 e 4 caracteres), caso a moeda seja uma moeda ficticia os outros dois campos precisam ser preenchido, seriam eles: "isFictional" campo booleano que indica que a moeda é ficticia, "currencyBackingUnitValue" campo numérico que indica o valor unitario da moeda na cotação do lastro(nessa caso, USD dólar). um exemplo para o campo currencyBackingUnitValue seria a cotação de 1 real em dolar:  BRL 1 = USD 0.1957, sendo assim, caso você cadastre uma nova moeda ficticia insida nesse campo a contação do de para com o dolar. Ex: HURB 1 = USD 0.2557 logo currencyBackingUnitValue = 0.2557

4 - Api de deleção de moeda espera receber apenas um parametro "currency" que é o codigo da moeda a ser deletada. O código precisa possuir de 3 a 4 caracteres. USD dolar não pode ser removido pois é utilizado como lastro.

5 - para iniciar a api, instale as dependencias utilizando o camando "npm install" na raiz do projeto e execute o arquivo index.js com o comando node index.js

6 - a api possui uma documentação em swagger, para acessa-la basta utilizar o endereço http://localhost:3000/doc, caso o swagger não esteja disponivel execute o arquivo swagger.js antes de iniciar a aplicação com o comando node swagger.js

7 - na raiz do projeto tambem pode ser encontrado um arquivo Dockerfile que prepara o projeto para utilização em um container docker para utilizalo basta rodar os comandos abaixo na raiz do projeto onde se encontra o arquivo "Dockerfile" (estou presumindo que a maquina já possua docker instalado):
    - docker build . -t hurb-challenge
    - docker run -p 3000:3000 -d hurb-challenge

8 - preparei um arquivo com a coleção tambem para postman (ferramenta de teste para chamadas de api) para utiliza-la basta apenas importar no postman o arquivo hurb-challenge.postman_collection.json

9 - a pasta test contem testes unitarios para o projeto, eu realizei apenas teste para 2 funções diferentes com o objetivo de demonstrar que eu sei fazer testes e como são feitos, não prolonguei muito nesse quisito pois estava com pouco tempo disponivel devido as demandas do meu trabalho
    - para executar os testes unitarios basta executar o comando npm run test na raiz do projeto
    - o projeto tambem possui configurado a lib NYC que é utilizado para cobertura de codigo para rodar os testes com cobertura basta apenas rodar o comando npm run coverage
    - a cobertura está configurada para falhar caso não atinja 80% do codigo com testes, nesse cenario ela irá falhar pois eu só fiz 2 testes unitarios, mas é apenas um exemplo.

10 - por ultimo mas não menos importante, a API está exposta na porta 3000, então todos os endpoints devem apontar para a porta 3000 e deve-se tomar cuidado para não iniciar a api em uma maquina no qual a porta 3000 ja esteja ocupada.

11 - O desafio foi aceito e realizado, espero que gostem !!.

obs - utilizem os arquivos .ts para avaliação do codigo, por favor.

