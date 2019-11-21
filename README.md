# Api para conversão de moedas

Api que recebe a moeda de origem, moeda de destino e um valor e retorna esse valor já convertido usando a cotação mais atual.
Foi usado a bliblioteca github.com/shopspring/decimal para melhorar a precisão dos cálculos financeiros devido a problemas conhecidos quando se usa Float64.

## Requisção

A requisição deve ser feita usando o verbo GET  com os parâmetros de moeda de origem, destino e o valor como querys strings.
Exemplo :
http://localhost:8000?amount=1&from=USD&to=BRL

## Para executar a aplicação:

 - Clonar esse repositório dentro da pasta SRC do seu GOPATH:  https://github.com/ViniciusReno/challenge-bravo.git
 - Entrar no diretório criado: cd challenge-bravo
 - Executar o comando "go get" para instalar as dependências
 - Executar o comando "go run main.go" para executar a aplicação
 - Para testar pode ser usado o Postman ou qualquer navegador
## Estrutura
```
├── app
│   ├── Models            // Models para a nossa aplicação
│   │   ├── response.go   // Model de resposta usada na conversão
│   └── Service
│       └── currency.go   // Serviço de conversão das moedas
├── main_test.go		  // Teste de Benchmark da aplicação
└── main.go
```
