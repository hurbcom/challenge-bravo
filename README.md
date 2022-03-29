# Pré-requisitos #

  1) Obter uma chave de autenticação para uso não comercial da API externa em [CurrencyAPI.net](https://currencyapi.net/register?plan=0) e alterar o valor da variável de instância "apiKey", da classe [CurrencyManager](CurrencyManager.php), com a chave obtida;
  2) Configurar o ambiente a ser utilizado;
  3) Criar a tabela de Banco de Dados conforme descrito no arquivo [challenge-bravo-DB.sql](challenge-bravo-DB.sql);
  4) Alterar os valores das variáveis de instância (server, db, user e pass) da classe [ConnectionFactory](ConnectionFactory.php) de acordo com o ambiente a ser utilizado;
  5) Executar o arquivo [inicializarAPI.php](inicializarAPI.php).

# Ambiente Utilizado #

  * PHP 7.2.24
  * cURL 7.58.0
  * MySQL 5.7.37
  * API externa - currencyapi.net
  * Servidor HTTP Apache 2.4.29
  * Sistema Operacional Ubuntu 18.04.6 LTS

# Solução Proposta #

 Este trabalho procurou implementar os requisitos solicitados, utilizando a seguinte arquitetura em camadas:

  * A classe [Currency](Currency.php) para descrever o modelo;
  * A classe [CurrencyDAO](CurrencyDAO.php) para realizar o acesso e a persistência dos dados;
  * A classe [CurrencyManager](CurrencyManager.php) para implementar as funções solicitadas nos requisitos do desafio;
  * A classe [SecurityManager](SecurityManager.php) para prover um controle básico dos valores inseridos nos parâmetros da API;
  * Os endpoints [convertCurrency](convertCurrency.php), [addCurrency](addCurrency.php), [updateCurrency](updateCurrency.php) e [removeCurrency](removeCurrency.php), para responder às requisições HTTP do tipo GET;
  * O endpoint [currencies](currencies.php) para tratar os verbos HTTP, funcionando como uma espécie de Adaptador, chamando o respectivo endpoint para os métodos POST, PUT, DELETE do protocolo HTTP.

## Exemplos de Uso ##

### Conversão de Moedas ###

  Método HTTP: GET  
  Parâmetros obrigatórios: from, to, amount    
  Endpoint: convertCurrency.php

    Exemplo: http://{LOCAL_DA_API}/convertCurrency.php?from={MOEDA1}&to={MOEDA2}&amount={MONTANTE}
  
  * Retorno esperado:

```json
    {
      "error":"", // true or false - se houve erro
      "from":"",  // parâmetro GET from 
      "to":"", // parâmetro GET to
      "amount":"", // parâmetro GET amount
      "result":"", // resultado da conversão
      "msg":"", // mensagem da API de erro ou sucesso
      "query-timestamp":"" // timestamp da consulta realizada
     }
```

### Adição de Moedas ###

  1) Via Browser URL:

    Método HTTP: GET   
    Parâmetros obrigatórios: code, name, rate  
    Endpoint: addCurrency.php

    Exemplo: http://{LOCAL_DA_API}/addCurrency.php?code={CODIGO}&name={NOME}&rate={COTACAO}
  
  2) Via método HTTP POST (utilizando CLI):

    Exemplo: curl -X POST -F "code={CODIGO}" -F "name={NOME}" -F "rate={COTACAO}" http://{LOCAL_DA_API}/currencies.php
  
  * Retorno esperado:

```json
    {
      "error":"", // true or false - se houve erro
      "code":"",  // parâmetro GET code 
      "name":"", // parâmetro GET nome
      "rate":"", // parâmetro GET rate - cotação em dolar
      "msg":"", // mensagem da API de erro ou sucesso
      "query-timestamp":"" // timestamp da consulta realizada
     }
```

### Atualização de Moedas ###

  1) Via Browser URL:

    Método HTTP: GET  
    Parâmetros obrigatórios: code, rate  
    Endpoint: updateCurrency.php

    Exemplo: http://{LOCAL_DA_API}/updateCurrency.php?code={CODIGO}&rate={COTACAO}
  
  2) Via método HTTP PUT (utilizando CLI):

    Método HTTP: PUT  
    Parâmetros obrigatórios: code, rate  
    Endpoint: currencies.php

    Exemplo: curl -X PUT -d "code={CODIGO}&rate={COTACAO}" http://{LOCAL_DA_API}/currencies.php

  * Retorno esperado:

```json
    {
      "error":"", // true or false - se houve erro
      "code":"",  // parâmetro GET code 
      "rate":"", // parâmetro GET rate - cotação em dolar
      "msg":"", // mensagem da API de erro ou sucesso
      "query-timestamp":"" // timestamp da consulta realizada
     }
```

### Remoção de Moedas ###

  1) Via Browser URL:

    Método HTTP: GET  
    Parâmetros obrigatórios: code  
    endpoint: removeCurrency.php

    Exemplo: http://{LOCAL_DA_API}/removeCurrency.php?code={CODIGO}
  
  2) Via método HTTP DELETE (utilizando CLI):

    Método HTTP: DELETE  
    Parâmetros obrigatórios: code  
    endpoint: currencies.php

    Exemplo: curl -X DELETE -d "code={CODIGO}" http://{LOCAL_DA_API}/currencies.php  
    
  * Retorno esperado:

```json
    {
      "error":"", // true or false - se houve erro
      "code":"",  // parâmetro GET code
      "msg":"", // mensagem da API de erro ou sucesso
      "query-timestamp":"" // timestamp da consulta realizada
     }
```
    
## Considerações ##
 
 Durante a implementação foram identificadas e tratadas as seguintes restrições de integridade:
 
 * Moedas criadas a partir da API não podem ter o mesmo nome que moedas já existentes;
 * Moedas criadas a partir da API não podem ter o mesmo código que moedas já existentes;
 * Moedas obtidas a partir da API externa não podem ter a cotação atualizada;
 * Moedas obtidas a partir da API externa não podem ser excluídas.
 
 E duas restrições externas impostas pelo uso gratuito da API currencyapi.net:
 
 * Quantidade de acessos permitido - 1250 requisições/mês;
 * Taxa de atualização das cotações - hora em hora.
 
  Por isso, esta solução também procurou economizar os acessos à API externa, tratando as requisições localmente, caso o intervalo entre o horário da última atualização e o horário atual seja menor do que uma hora.  
  
  Espero que gostem!
