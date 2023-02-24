## Descrição da API
API para conversão de moedas onde é possível realiza a conversão entre as moedas previamentes cadastradas. 

Existe um cronjob para manter as taxas de conversões atualizadas das principais moedas como Dolar (USD), Euro (EUR), Real (BRL), etc desde que a moeda esteja cadastrada no sistema.

A Modeda utilizada como lastro é o Dolar (USD).

É possível realizar todas as operações de CRUD de Moedas e realizar a Conversão.

## Etapas para poder executar a API
1. Instalar o docker-compose. [documentação](https://docs.docker.com/compose/install/linux/)
2. Na pasta raiz da API executar o comando para subir o serviço de banco e de cache
```
make docker-compose-up
```
ou
```
docker-compose up -d
```
3. 
```
make go-run
```
ou
```
go run server.go
```

## Documentação da API - Swagger

### Visualizar Documentação
- Acessar a rota [/docs](localhost:9000/docs) com a aplicação rodando

### Atualização da Documentação

1. Instalar na máquina o [go-swagger](https://goswagger.io/install.html)
2. Especificação das tags para geração automatica da documentação [aqui](https://goswagger.io/use/spec.html)
3. Executar o comando abaixo para atualizar a documentação
```
make swagger
```

## Descrição Técnica
1. Banco de dados Postgres por ser um serviço de banco relacional robusto, completo e open source que atende perfeitamente desde pequenas aplicações até apliações robustas.
2. Cache Redis por ser um serviço de cache robusto e amplamente utilizado. É possível inclusive passar a utilizar serviço de cache de nuvem como o memory store do GCP sem precisar mexer na aplicação.
3. Migration para controlar versionamento do banco de dados.
4. Health Check para monitor a aplicação está no ar e se os serviços de banco de dados e cache estão funcionando.

## Sugestões de Melhorias

1. Restringir acesso aos endpoints de CRUD de Moedas para evitar alteração indevida
2. Incluir na documentação da API a relação dos erros que podem ser retornado
3. Refatorar as validações de erros.
4. Criar paginação no endpoint que lista todas as Moedas
5. Substituir ID sequencial por UUID
6. Incluir cabeçalhos HTTP de segurança
7. Incluir controle de auditoria