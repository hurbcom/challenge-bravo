**Desafio Bravo**
----
  API para conversão monetária. Sua moeda de lastro é USD e seus dados são atualizados diariamente.

* **Instalação**

  Clone desse projeto: <br>
  `git clone https://github.com/pabloferreiradias/challenge-bravo.git`<br><br>
  Entre na pasta do projeto: <br>
  `cd challenge-bravo`<br><br>
  Crie o arquivo com as variáveis de ambiente: <br>
  `cp .env.example .env`<br><br>
  Suba as imagens do docker em segundo plano: <br>
  `docker-compose up -d`<br><br>
  Instale as dependencias: <br>
  `docker-compose exec app composer install`<br><br>

* **Moedas Padrão**

  -   USD
  -   BRL
  -   EUR
  -   BTC
  -   ETH

* **Testes Automaticos**

  `docker-compose exec app php artisan test`

**End-points**

* **API - Converter Valor**

  Esse método retorna o valor convertido.

* **URL**

  _localhost/_

* **Método:**
  
  <_Tipo de requisição_>

  `GET`
  
*  **Parametros na URL**

   **Requeridos:**
 
   `from=[string]`<br>
   `to=[string]`<br>
   `amount=[numeric]`<br>


* **Resposta com Sucesso:**

  * **Código:** 200 <br />
    **Conteúdo:** `{"amount":123.45,"from":"BRL","to":"EUR","convertedAmount":"19.43","lastUpdate":"2020-09-17 18:54:37","errors":[]}`

* **Resposta de Erro:**

  * **Conteúdo:** `["Origin currency not informed"]` <br />

  OU

  * **Conteúdo:** `{"amount":123.45,"from":"BBB","to":"EUR","errorMsg":"Chosen currency not suported yet.","errorParams":["BBB"]}` <br />
    

* **Exemplo de Chamada:**

  `http://localhost/?from=BRL&to=EUR&amount=123.45`

----

* **API - Moedas Disponíveis**

  Esse método retorna as moedas disponíveis para conversão.

* **URL**

  _localhost/avaliable-currencies_

* **Método:**
  
  <_Tipo de requisição_>

  `GET`

* **Resposta com Sucesso:**

  * **Código:** 200 <br />
    **Conteúdo:** `["USD","BTC","BRL","ETH","EUR"]`
    

* **Exemplo de Chamada:**

  `http://localhost/avaliable-currencies`

----

* **API - Adicionar nova moeda**

  Esse método adiciona uma nova moeda no banco de dados, a API irá tentar atualizar o valor dela após o cadastro.

* **URL**

  _localhost/api/_

* **Método:**
  
  <_Tipo de requisição_>

  `POST`
  
*  **Data Params**

   **Requeridos:**
 
   `currency=[string]`<br>
   `value=[numeric]`<br>

* **Resposta com Sucesso:**

  * **Código:** 200 <br />
    **Conteúdo:** `{"currency":"BBB","value":7.45,"hasAutomaticUpdate":false,"lastUpdate":"2020-09-17 17:57:48","errors":[]}`

* **Resposta de Erro:**

  * **Conteúdo:** `["Currency not informed"]` <br />

  OU

  * **Conteúdo:** `{"currency":"BBB","value":7.45,"error":"Currency already registred in database."}` <br />
    

----

* **API - Editar moeda**

  Esse método edita uma moeda já existente no banco de dados, caso o parâmetro `value` não seja informado, a API irá tentar atualizar o valor da moeda.

* **URL**

  _localhost/api/_

* **Método:**
  
  <_Tipo de requisição_>

  `PUT`
  
*  **Data Params**

   **Requeridos:**
 
   `currency=[string]`<br>

   **Opcional:**
 
   `value=[numeric]`<br>

* **Resposta com Sucesso:**

  * **Código:** 200 <br />
    **Conteúdo:** `{"currency":"BBB","value":7.45,"hasAutomaticUpdate":false,"lastUpdate":"2020-09-17 17:57:48","errors":[]}`

* **Resposta de Erro:**

  * **Conteúdo:** `["Currency not informed"]` <br />

  OU

  * **Conteúdo:** `{"currency":"BBB","value":7.45,"error":"Chosen currency not suported yet."}` <br />

  ----

* **API - Deletar moeda**

  Esse método deleta uma moeda do banco de dados.

* **URL**

  _localhost/api/_

* **Método:**
  
  <_Tipo de requisição_>

  `DELETE`
  
*  **Data Params**

   **Requeridos:**
 
   `currency=[string]`<br>

* **Resposta com Sucesso:**

  * **Código:** 200 <br />
    **Conteúdo:** `{"deletedCurrency":"BBB"}`

* **Resposta de Erro:**

  * **Conteúdo:** `["Currency not informed"]` <br />

  OU

  * **Conteúdo:** `{"currency":"BBB","error":"Currency not found in database."}` <br />
