# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Requisitos
- Node(=< v14.15.*)
- Yarn
- SqLite3
- Docker
- Utilizando api externa para consversão e consulta (https://api.exchangerate.host)

## Rodando a aplicacao
- Clone repositorio
- cd [diretorio_do_projeto]
- yarn (Instalação de dependencias/modulos)
- yarn sequelize db:migrate db:seed:all
- docker build -t [nome_da_imagem] .
- docker run -d -p 3000:3000 --rm --name [nome_container_desejado] [nome_imagem]
- http://localhost:3000/api/ChangeCurrency?from=BRL&to=USD&amount=10 (Exemplo)


## Endpoints
- [GET] /api/ChangeCurrency = querys(from, to, amount)
    - from = Sigla do país de origem da moeda fornecida (USD,BRL,EUR...) Apenas 1 valor
    - to = sigla do país para conversao (USD,BRL,EUR...) Apenas 1 valor
    - amount = valor a ser convertido (10.50, 151.78, 25...) Apenas 1 valor
    - Example http://localhost:3000/api/ChangeCurrency?from=BRL&to=USD&amount=10
    
- [POST] /api/AddCurrency = query(currency_name)
    - currency_name = Sigla do país a ser cadastrado
    - Example http://localhost:3000/api/AddCurrency?currency_name=TRR
    
- [DELETE] /api/RemoveCurrency = query(currency_name)
    - currency_name = Sigla do país a ser removido
    - Example http://localhost:3000/api/RemoveCurrency?currency_name=TRR

## Rodando testes
- yarn test (dentro do diretorio do projeto)

## Pontos de melhorias
- Cache de bancos cadastrados evitando consulta no banco para validar moedas aceitas
- Efetuar teste de performance utilizando mongodb para talvez uma migração (sqlite foi utilizado somente para o desafio)
- Internalizar o método de conversão e desenvolver um serviço que efetue consultas em algumas plataformas/fonts que forneça em tempo real a atualização de moedas cadastradas, reduzindo o tempo de resposta na conversão.
- Incluir testes unitarios para cobrir toda a aplicação
