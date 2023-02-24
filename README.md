## Descrição da API
API para conversão de moedas onde é possível realiza a conversão entre as moedas previamentes cadastradas. 

Existe um cronjob para manter as taxas de conversões atualizadas das principais moedas como Dolar (USD), Euro (EUR), Real (BRL), etc desde que a moeda esteja cadastrada no sistema.

No cadastro da Moeda contém a data de referencia da taxa de cambio utilizada para conversão isso ajuda o usuário a saber se a taxa está atualizada, principalmente para os casos de moedas que não são atualizadas automaticamente.

A Modeda utilizada como lastro é o Dolar (USD).

É possível realizar todas as operações de CRUD de Moedas e realizar a Conversão.

A documentação dos endpoints estão disponíveis na própria API "/docs".

## Etapas para poder executar a API na máquina local
1. Docker instalado
2. Docker-compose instalado. [documentação](https://docs.docker.com/compose/install/linux/)
3. Go instalado
4. Executar o comando abaixo na pasta raiz do projeto para subir os serviços de banco e de cache
```
make docker-compose-up
```
ou
```
docker-compose up -d
```
5. Executar o projeto
```
make go-run
```
ou
```
go run server.go
```
6. Endpoint da API [localhost:9000](localhost:9000)
7. Endpoin da documentação da API [localhost:9000/docs](localhost:9000/docs)

## Atualização da Documentação da API - Swagger

1. Instalar na máquina o [go-swagger](https://goswagger.io/install.html)
2. Especificação das tags para geração automatica da documentação [aqui](https://goswagger.io/use/spec.html)
3. Executar o comando abaixo para atualizar a documentação
```
make swagger
```

## Informações sobre a atualização automatica das taxas de cambio
Encontrei um endpoint publico para obter as taxas de cambio do Banco Central Europeu. [link](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)

Esse endpoint tem como lastro a moeda Euro (EUR) onde fiz um de/para no código para tornar o Dolar (USD) a moeda de lastro.

Optei por usar esse endpoint pela veracidade da informação por ser do Banco Central da Europa e também porque não encontrei facilmente um endpoint publico para obter a taxa de cambio em dolar, então preferi utilizar o tempo para implementar mais recursos na API que na minha visão acredito fazer mais sentido para vcs avaliarem a minha maturidade em desenvolvimento.

## Descrição Técnica
1. Banco de dados Postgres por ser um serviço de banco relacional robusto, completo e open source que atende perfeitamente desde pequenas aplicações até apliações robustas.
2. Cache Redis por ser um serviço de cache robusto, open source, amplamente utilizado e compatível com serviço de cache em nuvem como o memory store do GCP. O cace é utilizado para melhoria de performance no endpoint de conversão e para controle da atualiação automatica das taxas de cambio 
3. Migration para versionamento de alterações no banco de dados.
4. Health Check [localhost:9000/healthz](localhost:9000/healthz) para monitorar se a aplicação está no ar e se os serviços de banco de dados e cache estão funcionando.
5. Swagger para manter a documentação da API atualizada de forma automática utilizando tags no código.
6. CORS para poder permitir requisições de origem diferente da API.
7. Middleware para logar o resultado de todas as requisição contendo informações da origem da requisição e request id para ajudar no troubleshooting da aplicação. O request id ajuda a rastrear um a mesma requisição por diversos microservicos e as informações da origem ajudam a identificar se o problema está relacionado a uma origem ou dispositivo especifico.
8. CronJob que executa a cada 30 minutos para buscar as taxas de cambio do dia e atualizar nossa API. O endpoint utilizado é atualizado apenas uma vez por dia mas coloquei para rodar de 30 em 30 minutos caso aconteça algum erro no processo de atualização. Antes de fazer a requisição para obter as informações a API verifica se o mesmo já foi atualizado no dia e caso positivo ignora a execução.
9. Carregamento de configurações da API através de váriaveis de ambiente ou arquivo de configuração "config.env" na pasta raiz da aplicação.
10. Projeto já contém um arquivo config.env com todas as configurações necessárias para poder executar a API no ambiente local. 
11. Docker-compose para poder subir os serviços de banco de dados e cache para poder rodas a API no ambiente local.
12. Dockfile para poder realizar o build da API e gerar imagem docker para rodar no ambiente local.
13. Github action para validar PR e Push para a branch main iniciando um processo de CI/CD.
14. Makefile para poder executar de forma simples diversos comandos.
15. É possível trocar o manipulador de rotas, banco de dados e serviço de cache facilmente devido a utilização do Clean Architecture no projeto.

## Sugestões de Melhorias

1. Restringir acesso aos endpoints de CRUD de Moedas para evitar alteração indevida
2. Incluir na documentação da API a relação dos erros que podem ser retornado
3. Refatorar as validações de erros.
4. Criar paginação no endpoint que lista todas as Moedas
5. Substituir ID sequencial por UUID
6. Incluir cabeçalhos HTTP de segurança
7. Incluir controle de auditoria
8. Atualização assincrona das moedas através do cronjob

**Obs:** Com certeza tem mais melhorias a ser feita tanto no código quanto na documentação. Melhoria continua deve fazer parte da vida útil de toda aplicação.

# Espero que gostem bastante do projeto que entreguei ;)
Como disse anteriormente com certeza tem melhorias a ser feita, pois toda vez que olho um código escrito por mim ou outra pessoal sempre vejo que é possível melhorar.
É muito provável que possa ter esquecido de incluir informações na documentação e caso aconteça peço desculpas antecipadamente.