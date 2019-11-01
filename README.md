# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Challenge Bravo

Challenge Bravo é uma API feita em PHP para conversão monetária, tendo como moeda lastro o Dólar Americano(USD).

A resposta é em formato JSON, com valores reais e atuais.

Originalmente, a API converte as seguintes moedas:

| Moeda Real | Moeda Virtual |
|------------|---------------|
| BRL        | BTC           |
| EUR        | ETH           |
| USD        |               |

Moedas podem ser adicionadas ou removidas. O Dólar Americano(USD) é a única moeda que não pode ser removida.

## API Endpoints

Challenge Bravo possui 4 endpoints, tendo como base a seguinte URL:

*/api/*

Ex: `http://localhost:8081/challenge-bravo/api/`

### 1 - Conversão

Para converter o valor de uma moeda para a outra, é usado o método **GET**.

?from=BRL&to=USD&amount=1

Ex: `http://localhost:8081/challenge-bravo/api/?from=BRL&to=USD&amount=1`

| Variável | Descrição                |
|----------|--------------------------|
| from     | Moeda de origem          |
| to       | Moeda final              |
| amount   | O valor a ser convertido |


### 2 - Adição
Para adicionar uma moeda, é usado o método **POST**.

Ex: `http://localhost:8081/challenge-bravo/api/`

| Variável    | Descrição                                    |
|-------------|----------------------------------------------|
| code        | Código da moeda (3 letras)                   |
| name        | Nome da moeda                                |
| is_crypto*  | **1** - Moeda virtual; **0** - moeda real    |

*`Caso não informado, o valor padrão utilizado é 0.`*

### 3 - Exclusão
Para exclusão de uma moeda, é usado o método **DELETE**.

/code

Ex: `http://localhost:8081/challenge-bravo/api/code`

| Variável    | Descrição                       |
|-------------|---------------------------------|
| code        | Código da moeda (3 letras)      |


### 4 - Listagem
Para listagem de moedas suportadas pela API, é usado o método **GET**.

/api/list

Ex: `http://localhost:8081/challenge-bravo/api/list`



## Respostas da API

O formato da resposta da API é em **JSON**

Toda resposta tem em comum os atributos **success** e **body**

### Exemplo de resposta

#### Conversão entre moedas

*Conversão feita com sucesso: `http://localhost:8081/challenge-bravo/api/?from=BRL&to=USD&amount=1`*
```
{
   "success":true,
   "body":{
      "from":"BRL",
      "to":"USD",
      "amount":"1",
      "result":0.24946716930975055
   }
}
```

*Conversão feita com erro: `http://localhost:8081/challenge-bravo/api/?from=BRL&to=USD`*
```
{
   "success":false,
   "body":{
      "error_code":400,
      "error_message":"Valor nao informado."
   }
}
```


## Resposta ao Desafio Bravo [ver desafio](https://github.com/hurbcom/challenge-bravo)


1. O desafio foi feito em:
  - PHP Version 7.1.22
  - MySQL Version 5.6.28


2. Nenhum framework foi utilizado. [DbPDO](/api/class/DbPDO.class.php) e [.htaccess](/api/.htaccess) não foram criados por mim.


3. Testes:
  - Codigo: realizados com Postman 2 e Insomnia (todos os requests feitos com sucesso)
  - Estresse: artillery (suporta mais de 1000 requests por segundo)


4. Segurança:
  - Não foi utilizado SSL
  - Não existe limitação para o número de acessos
  - Senha do banco de dados exposta (preferencialmente usar fora do diretório raiz)
  - Não foi feito um sistema de logs


5. Instalação
  - Acessar o diretorio htdocs(ou similar como www) do servidor
  - Executar o comando: git clone https://github.com/RenanAguiar/challenge-bravo.git
  - Criar um novo banco no MySQL e importar: /db/bravo.sql
  - Alterar o arquivo /api/config.php com os seus dados de acesso ao banco MySQL


6. Obervações
  - Docker não foi utilizado pois não consegui levantar o PHP
  - Para a moeda USD não ser removida, criei um Trigger no MySQL
  - Como o desafio é back-end, não foi criado um front-end para o retorno da API
  - Foi utilizado macOS Mojave(version 10.14.6) com MAMP 7.1.22-0 para o desenvolvimento
