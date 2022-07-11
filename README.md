# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

# Conversão Monetária
    Foi desenvolvido uma aplicação para conversão monetária de moedas reais e fictícias, de acordo com os requisitos do desafio.
    Foi utilizado o Real (BRL) como moeda de lastro pois a API pública consumida [AwesomeApi] também o utilizao.

## Aplicação inclui
    - API REST - Feito em [.NET 6.0], contendo autenticação JWT Bearer, método para obtenção do token, conversão dos valores e operações CRUD de moedas, o endpoint para conversão de valores não necessita de autenticação (Bearer token).
    - Serviço em de segundo plano (Worker) - Feito em [.NET 6.0]. Com um ciclo de 10 segundos executa a rotina de alimentação de cotações reais na base de dados e alimentando Classe singleton responsavel para fazer a conversão em mémoria vizando a agilidade de resposta para o metodo de conversão de valores. A API do AwesomeApi (https://docs.awesomeapi.com.br/api-de-moedas) foi utilizada para consumir essa informação.
    - Base de dados - Foi utilizado o sistema de banco de dados [SQLite] junto ao [EF6.0] para persistência dos dados, primeiramenta estava sendo desenvolvida com banco [Postgre] mas pensando em simplificar a execução foi trocado para [SQLite].
    - Foram desenvolvidos testes unitários utilizando [Xnuit].
    - Arquitetura modelada seguindo os aspectos do conceito de [DDD].

## Informações
A aplicação suporta a conversão das seguintes moedas nativamete: BRL, USD, CAD, GBP, ARS, BTC, ETH e EUR. 
Novas moedas podem ser adicionadas, as descritas estão inclusas no Seed do banco de dados como padrão. 
Você pode adicionar, editar, remover qualquer moeda.
Somente as moedas disponíveis na API [AwesomeApi] receberão a cotação de forma automática, outras farão a conversão com a inforção de seu cadastro.

## API
Todas as rotas seguem a convenção REST e os retornos são em JSON. 
A API Web também disponibiliza o recurso `/Swagger` para documentação da API.

A API consiste em três seções: 
[Autenticacao] `/autenticacoes` Utilizada para obter o token de autorização para o CRUD de moedas;
[ConversaoMonetaria] `/converter` Realiza a conversão monetária entre moedas;
[Moedas] `/moedas` Contendo operações de CRUD das moedas;

Toda documentação foi adicionada via [swagger] em `/swagger/index.html`,
por padrão execuratá no link: `https://localhost:5001/swagger/index.html`

## Melhorias Futuras
- Adicioanar controle de usuários para geração de tokens para operações das moedas.
- Alterar retorno padrão para retornar lista de criticas.
- Aumentar a cobertura de testes, adicionando testes e integração e e2e também.
- Adicionar tabela de historico de cotações para utilizar para análise de variações no furuto.

## Execução

Para execução basta abrir o arquivo `ConversaoMonetaria.sln` com a IDE escolhida, utilizei o Rider, e executar. A criação do banco e execução do migration será feita automáticamente.
Acesse o link `https://localhost:5001/swagger/index.html` para obter a documentação.

## Testes
Foram executados testes de cargas com `Jmeter`, obtendo resultados de certa de 17 mil requisições por segundo.

<p align="center">
  <img src="teste_carga.jpg" alt="testedecarga" />
</p>
