# Conversor de moedas

Olá!
Se você está lendo este Readme, é porque eu sobrevivi.
Quero agradecer a vocês pelos desafios propostos e confesso que aprendi pra caramba com este desafio pelo qual comito.
Acabei de sentir a sensação de estar mais esperto em relação as adversidades e como um viciado, quero mais!

A tarefa está realizada e com muito orgulho faço aqui um checklist das tarefas cumpridas.

# Critério de avaliação

- [x] **Organização do código**: Separado em módulos MVC 
- [x] **Clareza**: Queria muito deixar cada detalhe a cada commit, mas sou muito detalhista. O detalhe está aqui e agora
- [x] **Assertividade**: Funcionando completamente
- [x] **Legibilidade do código** Apliquei os comentários para que melhore o entendimento. Contudo. Ele está easy, auto explicável
- [x] **Segurança**: Hã? :0)  estou brincando. Criei pequenas regras com Try/catch para que seja minimizada os danos
- [x] **Cobertura de testes** Fiz as coberturas esperadas, contudo, sem Mocks. É preciso ter dado para que seja testado
- [x] **Histórico de commits** Meus commits foram poucos. Confesso. É estranho programar só e fazer altos commits
- [x] **UX**: Por se tratar de uma API, ele não tem design. Só design pattern
- [x] **Escolhas técnicas**: Fiz inumeras pesquisas para que haja confiabilidade e segurança nas bibliotecas envolvidas


## Escolhas técnicas:

* Banco de dados: MongoDB
* Linguagem: JavaScript (NodeJS)
* Bibliotecas usadas:
    1. ExpressJS
    2. Mongoose
    3. Mocha, Chai, chai-http e Should (Testes)

* Teste de Stress
    1. Artillery

**Optei por criar banco de dados local, contudo, sinta-se a vontade para mudar para a nuvem**

### Instalação de dependências
    * npm install
    * npm install -g artillery  (Para teste de Stress)

### Inicialização
    * npm start


### Teste
    * npm test


### Usabilidade

1. A Api possui para cada endpoint um serviço distinto.
* GET: http://localhost:3000/quotation/
    Este é o endpoint responsável para realizar a contação. De acordo com o exemplo **?from=BTC&to=EUR&amount=123.45** é permitido através do mesmo realizar a sua cotação de moedas contidas dentro do Banco de dados.
    * Através de uma pesquisa e para aplicar mais realismo ao serviço, a resposta da cotação é realizada com 3 parametros de informação. O valor Comercial, Turismo e Paralelo.
    Para maiores informações consulte o link cujo explica sobre a cotação do Dólar como referência: https://artigos.toroinvestimentos.com.br/dolar-hoje-cotacao-conversor 
    * A regra de pesquisa é identica a do enunciado. Aplicasse ao 'key' -> from e to e 'value' -> amount, os valores desejados para a obtenção da cotação desejada.

* POST: http://localhost:3000/insertcoin
    Para gravação das informações é preciso utilizar a informação em Json de acordo com este exemplo:
    ```
    {
	"name":"btc",
	"com":"5.8",
	"tur":"1.6",
	"par":"5.2"
    }
    ```
    A Inserção do Json foi realizada com a Ferramenta Postman; utilizando o critério de endereçamento POST e Body em formato raw com o recebimento em JSON

* DELETE: http://localhost:3000/clear/
    A deleção do registro é realizado pelo ID do registro.
    ``` 
    http://localhost:3000/clear/ + id 
    ```

    Na ferramenta Postman é somente preciso inserir o endereço com o identificador na opção DELETE; se ele existir, será removido.


________________________________________

* Testes automatizados
    1. O teste é realizado com o Mocha e Chai com exemplo real. Para realiza-lo é necessário ter informação no banco de dados __Para teste e Get e Delete__

* Teste de Stress
    1. O teste foi realizada com o Artillery, realiada com o seguinte código no prompt de comando:
    ```
    artillery quick --count 1000 -n 2 http://localhost:3000/quotation/?from=btc&to=dol&amount=300.50
    ```

    Obtida o seguinte resultado:
    ```
    Elapsed time: 21 seconds
    Scenarios launched:  1
    Scenarios completed: 2
    Requests completed:  3
    RPS sent: 4
    Request latency:
        min: 1.2
        max: 32.3
        median: 1.6
        p95: 32.3
        p99: 32.3
    Codes:
        400: 3
    ```

**É necessário levar em consideração a configuração baixa do meu notebook**

Isso é tudo. Obrigado ;0)