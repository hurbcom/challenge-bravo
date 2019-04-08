**API de Conversão Monetária**
----
  Retorna o resultado de uma conversão monetá baseada na moeda de origem e na moeda de destino.

* **URL**

  /api/convert:from:to:amount

* **Método:**

  `GET`
  
*  **Parâmetros URL**

   **Obrigatórios:**
 
   `from=[]`
   
   `to=[integer]`
   
   `amount=[float]`

* **Data Params**

  None

* **Successo:**

  * **Code:** 200 <br />
    **Content:** `{ value : 25,00 }`
 
* **Erros:**

  * **Code:** 404 NOT FOUND <br />

  ou

  * **Code:** 200 <br />
    **Content:** `{ [parâmetro] : [mensagem] }`

* **Chamada de Exemplo:**

  ```javascript
    $.ajax({
      url: "http://cbravo.local/api/convert?from=BaRL&to=USD&amount=100.00",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```