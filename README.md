# Pré-requisitos #

  1) Obter uma chave de autenticação para uso não comercial da API externa em [CurrencyAPI.net](https://currencyapi.net/register?plan=0) e inserí-la como o valor da variável de instância "apiKey", da classe [CurrencyManager](api-bravo/CurrencyManager.php)[^1], com a chave obtida;
  [^1]: Este arquivo foi alterado para se adequar à implantação com Docker. Para utilizá-lo da forma aqui descrita, será também necessário remover o construtor da classe.
  2) Configurar o ambiente a ser utilizado;
  3) Criar a tabela de Banco de Dados conforme descrito no arquivo [challenge-bravo-DB.sql](challenge-bravo-DB.sql);
  4) Alterar os valores das variáveis de instância (server, db, user e pass) da classe [ConnectionFactory](api-bravo/ConnectionFactory.php) de acordo com o ambiente a ser utilizado;
  5) Executar o arquivo [inicializarAPI.php](api-bravo/inicializarAPI.php).

# Ambiente Utilizado #

  * PHP 7.2.24
  * cURL 7.58.0
  * MySQL 5.7.37
  * API externa - currencyapi.net
  * Servidor HTTP Apache 2.4.29
  * Sistema Operacional Ubuntu 18.04.6 LTS

# Solução Proposta #

 Este trabalho procurou implementar os requisitos solicitados, utilizando a seguinte arquitetura em camadas:

  * A classe [Currency](api-bravo/Currency.php) para descrever o modelo;
  * A classe [CurrencyDAO](api-bravo/CurrencyDAO.php) para realizar o acesso e a persistência dos dados;
  * A classe [CurrencyManager](api-bravo/CurrencyManager.php) para implementar as funções solicitadas nos requisitos do desafio;
  * A classe [SecurityManager](api-bravo/SecurityManager.php) para prover um controle básico dos valores inseridos nos parâmetros da API;
  * Os endpoints [convertCurrency](api-bravo/convertCurrency.php), [addCurrency](api-bravo/addCurrency.php), [updateCurrency](api-bravo/updateCurrency.php) e [removeCurrency](api-bravo/removeCurrency.php), para responder às requisições HTTP do tipo GET;
  * O endpoint [currencies](api-bravo/currencies.php) para tratar os verbos HTTP, funcionando como uma espécie de Adaptador, chamando o respectivo endpoint para os métodos POST, PUT, DELETE do protocolo HTTP.

# Exemplos de Uso #

## Conversão de Moedas ##

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

## Adição de Moedas ##

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

## Atualização de Moedas ##

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

## Remoção de Moedas ##

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

# Considerações #

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

# Adicionando Implantação com Docker #

## Ambiente Utilizado ##

  * Docker 20.10.7
  * Docker Compose 1.17.1
  * Imagens:
    * Servidor HTTP: php:7.2-apache[^2]
    [^2]: Com as extensões pdo e pdo_mysql adicionadas via [Dockerfile](Dockerfile)
    * Banco de dados: mysql:5.7
    * Interface de Acesso ao banco de dados: phpmyadmin/phpmyadmin (Opcional)
  * API externa - currencyapi.net

## Configuração Ambiente ##

  1) Instalar o Docker e o Docker Compose (preferencialmente nas versões informadas na subseção anterior)
  2) Clonar este repositório (git clone https://github.com/alexandre-abdalla/challenge-bravo.git)
  3) Obter uma chave de autenticação para uso não comercial da API externa em [CurrencyAPI.net](https://currencyapi.net/register?plan=0) e inserí-la no arquivo [apiKey.txt](apiKey.txt), em branco, encontrado na raiz do repositório;
  4) Navegar até o diretório clone deste repositório e executar o comando docker-compose up -d --build
  5) Inicializar a API de uma das seguintes maneiras:  
    5.1) Via browser: Acessar a URL: http://localhost:8088/inicializarAPI.php  
    5.2) Via CLI:  
        5.2.1) curl http://localhost:8088/inicializarAPI.php  
        5.2.2) docker-compose run web-server php /var/www/html/inicializarAPI.php [^3]  
        [^3]: No diretório clone deste repositório

  Após isso, é esperado que o sistema retorne a mensagem "API carregada com sucesso!".

  OBS: Os exemplos de uso podem ser seguidos, de acordo com a seção [Exemplos de Uso](https://github.com/alexandre-abdalla/challenge-bravo/blob/main/README.md#exemplos-de-uso), alterando {LOCAL_DA_API} por localhost:8088.

# Adicionando Teste de Desempenho #

## Ambiente Utilizado ##

  * Notebook (descrição de hardware em [lshw.txt](lshw.txt))
  * Sistema Operacional Ubuntu 18.04.6 LTS
  * Instâncias Virtualizadas com o Docker Compose:
    * Apache/2.4.38 (Debian)
    * PHP 7.2.34
    * MySQL 5.7.38
  * Jmeter 2.13.20170723

## Arquivos de Teste ##

  * [Conversão de moedas](testes/Docker%20-%20Teste%20Conversão.jmx)
  * [Inclusão de moedas](testes/Docker%20-%20Teste%20Inclusão.jmx)
  * [Atualização de moedas](testes/Docker%20-%20Teste%20Atualização.jmx)
  * [Remoção de moedas](testes/Docker%20-%20Teste%20Remoção.jmx)

## Resultados dos Testes ##

  * [Conversão de moedas](testes/Docker%20-%20Teste%20Conversão%20-%20Resultado.csv)
  * [Inclusão de moedas](testes/Docker%20-%20Teste%20Inclusão%20-%20Resultado.csv)
  * [Atualização de moedas](testes/Docker%20-%20Teste%20Atualização%20-%20Resultado.csv)
  * [Remoção de moedas](testes/Docker%20-%20Teste%20Remoção%20-%20Resultado.csv)
