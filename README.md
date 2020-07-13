# Challenge-Bravo

## Autor
Andrews Coura Monzato

## Problema
Construir uma API, que responda JSON, para conversão monetária.  
A API por padrão aceita as moedas:  
  - USD
  - BRL
  - EUR
  - BTC
  - ETH<br/>  

A API tem a capacidade de trabalhar com mais moedas, de acordo com a necessidade do usuário (mais informações no setor Utilização).  
A API utiliza como moeda de lastro o USD.  

## Linguagem Utilizada
Python 3.6.9

## Sistema Operacional Utilizado
Ubuntu 18.04.4 LTS

## Requisitos
 * Git >= 2.17.1
 * Python >= 3.6
 * Pip >= 20.0.2
 * Request == 2.24.0

## Instalação
1. git clone https://github.com/andrewsmonzato/Challenge-Bravo challenge-bravo
1. cd challenge-bravo
1. pip3 install requests
1. python3 challenge-bravo.py

## Utilização
A API trabalha majoritariamente com a requisição GET e trabalha com o sistema de endpoints descritos abaixo.
A resposta da API tem o formato :
```python
server_response_dict = {
      "code": return_code,
      "message": return_message,
      "data": return_data
  }
```
### Endpoints
- **/price** <br/>
  Exemplo : localhost:8080/price <br/>
  Função : Exibe cotação de todas as moedas disponiveis para a moeda de lastro (USD) <br/>
  Padrão Data:
  ```python
    {
        [{
        "from": USD,
        "to": data_to[0],
        "rate": data_rate,
        "last_update": data_lastup
        },
        {
        "from": USD,
        "to": data_to[1],
        "rate": data_rate,
        "last_update": data_lastup
        },
        . . .
        ]
  }
  ```  
  <br/>
  
- **/price?from=DATA1&to=DATA2&amount=DATA3** <br/>
  Tipos :
  * DATA1 : Código do país de origem. Tipo : string;
  * DATA2 : Código do país de destino. Tipo : string;
  * DATA3 : Quantia a ser cotada. Tipo : float. <br/>  

  Exemplo: localhost:8080/price?from=BRL&to=USD&amount=130.00 <br/>
  Função : Exibe cotação requisitada <br/>
  Padrão Data:
  ```python
    {
        "from": data_from,
        "to": data_to,
        "rate": data_rate,
        "in_amount": data_amount,
        "out_amount": (rate_to/rate_from)*data_amount,
        "last_update": data_lastup
    }  
<br/>  

- **/inccurrency?code=DATA1** <br/>
    Tipos :
    * DATA1 : Codigo da cotação a ser inserida. Tipo : string. <br/>  
    
    Exemplo: localhost:8080/inccurrency?code=ARS <br/>
    Função : Se existir moeda com codigo requisitado, incluir na lista de cotações disponíveis <br/>
    Padrão Data:
    ```python
      {
          "action":"DATA1 foi incluido na lista de moedas a serem cotadas"
      }  
<br/>   

- **/rmccurrency?code=DATA1** <br/>
    Tipos :
    * DATA1 : Codigo da cotação a ser removida. Tipo : string. <br/>  
    
    Exemplo: localhost:8080/rmccurrency?code=ARS <br/>
    Função : Se existir moeda com codigo requisitado na lista de cotaçes ativas, a remove <br/>
    Padrão Data:
    ```python
      {
          "action":"DATA1 foi removido na lista de moedas a serem cotadas"
      }  
    


