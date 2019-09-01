# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo


API para cadastro de moedas e a realização de conversões entre moedas.

Inicialmente eu comecei a desenvolver a API com Django e DRF, mas devido a preocupação com performance resolvi testar Golang. É a primeira aplicação minha desenvolvida na linguagem e os maiores desafios foram na parte de gerenciar as dependências do go, principalmente na criação da imagem do container docker.

## Instalação

#### Docker Compose (recomendado)


- Clone: ` git clone https://github.com/EltonARodrigues/challenge-bravo.git `
- Branch: ` git checkout imp-golang `
- Run: ` sudo docker-compose up -d `

obs: O build demora um pouco para baixar as dependências do projeto
obs2: A aplicação reiniciara até que a imagem do mysql esteja rodando.

#### Sem docker ou docker-compose

Necessita ter mysql e redis instalado na máquina, e coloca o endereço no arquivo config.yaml
- Clone: ` git clone https://github.com/EltonARodrigues/challenge-bravo.git `
- Branch: ` git checkout imp-golang `
- Dir: `cd currency-api-go/app`
- Run: `go run main.go`


### Recursos e endpoints

Body:  `{"code": "BRL", "usd_value": 4.10 }`

| Método | Resurso | Descrição |
| -|- | - |
| GET | `http://localhost:3000/convert/?from=BRL&to=BTH&amount=10` | Converte moedas |
| GET |   `http://localhost:3000/import_all/` | Importa valores da api externa |
| GET |   `http://localhost:3000/currencys` | Mostra todos os valores |
| POST | ` http://localhost:3000/currencys `  | Insere um novo valor |
| DELETE | `http://localhost:3000/currencys/BRL` | Deleta uma moeda (ex: BRL) |
| PUT |   `http://localhost:3000/currencys/BRL` | Modifica uma moeda parcialmente  (ex: BRL) |


| Tecnologias | |
|----|--|
| Golang | Linguagem principal da API |
| Mysql | Banco de dados responsável por guardar as moedas |
| Redis | Usado como cache das conversões por um x segundos|

# Coisas a fazer no futuro quem sabe

- Documentação da API. ex: Swagger;
- Usar variáveis de ambiente em vez do arquivo de configuração;
- Melhorar download de dependências no processo de build com Docker;
- Trocar banco de dados para um não relaciona;
- Aprofundar tests com Go;
- /Import_all/ deve atualizar os em caso de duplicata.

### Material Usado

O material mais relevante usado para a contrução da aplicação:

- [Golang RESTful API using GORM and Gorilla Mux](https://www.golangprograms.com/golang-restful-api-using-grom-and-gorilla-mux.html)
- [Effective Go](https://golang.org/doc/effective_go.html)
- [Go: implementando cache em APIs REST](https://imasters.com.br/back-end/go-implementando-cache-em-apis-rest)
- [Using Go Modules](https://blog.golang.org/using-go-modules)
