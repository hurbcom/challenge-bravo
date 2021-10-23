
# Desafio Bravo

## Projeto
Conforme proposto no desafio, esse projeto é uma API capaz de realizar conversões monetários entre diferentes moedas e retornar o resultado em formato JSON. Além disso, esse projeto também contempla algumas funcionalidades que permitem que sejam adicionadas, removidas ou atualizadas novas moedas (reais ou fictícias), assim como a opção de configurar a atualização automática desses valores a partir de uma API de cotações atualizadas.

O sistema foi dividido em dois módulos principais, o primeiro responsável por atender as chamadas da API, e o segundo responsável pela atualização automática dos valores.

## Tecnologias
As principais tecnologias utilizadas no desenvolvimento desse projeto foram:

- **.Net Core 3.1**: Essa linguagem foi escolhida por conta de uma maior familiaridade com o uso dela, além de boas opções para o desenvolvimento de APIs do tipo. Já a versão **Core** foi selecionada por conta de sua maior portabilidade entre sistemas.

- **SQLite**: Esse banco de dados foi selecionado por conta de sua facilidade de uso, com fácil integração a linguagem escolhida e conseguindo atender bem as necessidades iniciais do projeto. Em um ambiente de produção de maior escala, este pode ser facilmente substituído por um banco SQL com um servidor dedicado e de sintaxe similar.

- **Docker**: Serviço escolhido para facilitar ainda mais a portabilidade e a execução do código em qualquer ambiente.

- **Visual Studio**: IDE escolhida por conta de sua grande integração com a linguagem selecionada, conseguindo prover uma grande gama de serviços úteis ao desenvolvimento desse projeto.

## Arquitetura

Como dito anteriormente, para a elaboração desse sistema, foram desenvolvidos dois programas principais e alguns outros auxiliares.

O primeiro ficou responsável pelos serviços fornecidos pela API. Foram desenvolvidos dois controladores principais, sendo que um deles ficou responsável pelas operações em cima das moedas disponíveis, permitindo a adição, leitura, atualização e remoção delas (seguindo a ideia RESTful); e o segundo responsável pelas operações de conversão, permitindo converter um dado valor entre qualquer uma das moedas existentes no banco. 

O segundo, atua com a premissa de manter os valores das cotações das moedas adicionadas sempre atualizadas a partir de valores retornadas por uma API externa de cotação, funcionando de maneira autônoma. Esse processo é registrado como um serviço a ser executado em background assim que a API é inicializada, rodando em cima de um timer e atualizando os valores para todas as cotações reais na base a cada 5 minutos (esse valor pode ser configurável para maiores ou menores periódos). 

A API externa escolhida foi a [Awesome API](https://docs.awesomeapi.com.br/api-de-moedas), por conta da sua facilidade na integração e bons resultados retornados.

Fora isso, foram desenvolvidas uma interface de acesso ao banco, tentando otimizar o acesso às informações e melhorar o desempenho. Como dito anteriormente, optou-se por utilizar da tecnologia SQLite por conta da linguagem SQL, amplamente utilizada, a facilidade de uso, já que trata-se de um banco centralizado embutido em um único arquivo, e que conseguiria atender bem dado a escala inicial do projeto. Futuramente, como comentado, pode-se optar por utilizar um banco externo dedicado para maior performance ou para contemplar uma maior quantidade de informações.

Por último, foi incluído também um esquema básico de autenticação ao projeto, que exige uma ApiKey a ser recebida na chamada para permitir o uso dos serviços disponíveis. Foi utilizada a chave básica "HURB_ChallengeBravo" para fins de ilustração.

## Instalação e execução

Para a execução do programa, basta apenas clonar esse projeto, navegar até ao diretório principal dele e executar o seguinte comando docker:

```
docker-compose -f docker-compose.yaml up
```

A primeira execução pode levar alguns minutos, já que pode ser necessário o download de alguns conteúdos para a geração de uma primeira imagem Docker. 

Uma vez que esse processo esteja concluído, a API já estará pronta para uso no endereço 'http://localhost:5000/'.  A versão aqui incluída desse projeto já inclui um arquivo inicial para o banco de dados, contendo algumas moedas reais já pré configuradas (USD, BRL, EUR, BTC, ETH). A sua cotação será atualizada automaticamente a partir da API externa na primeira execução do programa. 

Todas as informações de valores estão armazenadas usando uma moeda de lastro (USD) e todas as operações são realizadas a partir dela. Por conta disso, essa moeda está registrada como 'Default' na base e não pode ser removida ou ter nenhuma de suas informações alteradas.

## API

Nessa seção serão descritas todas as rotas disponíveis para os serviços descritos anteriormente, assim como qual o método de chamada a ser utilizado e os parâmetros que são possíveis e/ou necessários para cada execução. Todas elas precisam incluir uma APIKey ao fim da url para serem validadas pelo servidor.

| Métodos				| Rota								| Métodos 	|
| :---        					|    :----:   						|    ---: 			|
| CreateCurrency	| /api/CreateCurrency	| POST		|
| UpdateCurrency	| /api/UpdateCurrency	| PUT			|
| GetCurrency		| /api/GetCurrency		| GET			|
| DeleteCurrency	| /api/DeleteCurrency	| DELETE	|
| ListCurrencies		| /api/ListCurrencies		| GET   		|
| ConvertCurrency	| /api/ConvertCurrency	| GET   		|

Todas as respostas da API, por padrão, serão retornadas no formato Json e irão conter dois campos obrigatórios. O primeiro é o campo de "Success", que se trata de um flag que indica se a operação foi concluída ou não com sucesso. O segundo é o campo de Status que irá retornar uma mensagem detalhando o resultado da operação.

Para efeito de organização e exemplificação, elas serão divididas em duas categorias de acordo com a sua natureza e detalhadas a seguir:


### API de Moedas

#### CreateCurrency

Permite criar novas moedas e adicioná-las para serem usadas futuramente. Recebe como parâmetro quatro campos:
- **Name**: O nome da moeda a ser adicionada. Não pode ser igual a uma outra já existe e não pode estar vazio;
- **PriceValue**: A cotação da moeda, ou seja, quanto vale 1 unidade dessa moeda. Deve obrigatoriamente ser um número decimal acima de zero. Não pode estar vazio;
- **AutoUpdatePrice**: Um booleano que irá indicar se a moeda deve ser atualizada automaticamente pelo processo ou não. É opcional na chamada e seu valor padrão é falso.
- **PriceCurrency**: Qual a unidade em que a cotação inicial passada se encontra. É usada para realizar a conversão para a cotação na moeda de lastro se necessário. Se trata de um campo opcional e seu valor padrão, caso não seja informado, é assumido como sendo USD.

**Resposta**: Retorna apenas os campos padrões, ou seja, o booleano Result, indicando se a operação foi bem sucedida, e o campo Status, que inclui uma mensagem detalhando o resultado.

Pode ser acessada através da requisição:
	```
	POST: http://localhost:5000/api/CreateCurrency?ApiKey=HURB_ChallengeBravo
	```

No corpo da requisição deve ser enviado os parâmetros descritos. Exemplo:
```
{
	"Name":"HURB",
	"PriceValue":2.0,
	"AutoUpdatePrice":false,
	"PriceCurrency":"BRL"
}
```

#### UpdateCurrency	

Permite atualizar informações de moedas já inseridas no banco de dados. Com exceção do nome, qualquer uma das outras informações podem ser alteradas. Recebe como parâmetro quatro campos:
- **Name**: O nome da moeda a ser adicionada. Deve necessariamente coincidir com o nome de uma moeda já registrada no serviço e não pode estar vazio;
- **PriceValue**: A cotação da moeda, ou seja, quanto vale 1 unidade dessa moeda. Deve obrigatoriamente ser um número decimal acima de zero. Não pode estar vazio;
- **AutoUpdatePrice**: Um booleano que irá indicar se a moeda deve ser atualizada automaticamente pelo processo ou não. É opcional na chamada e seu valor padrão é falso;
- **PriceCurrency**: Qual a unidade em que a cotação inicial passada se encontra. É usada para realizar a conversão para a cotação na moeda de lastro se necessário. Se trata de um campo opcional e seu valor padrão, caso não seja informado, é assumido como sendo USD.

**Resposta**: Retorna apenas os campos padrões, ou seja, o booleano Result, indicando se a operação foi bem sucedida, e o campo Status, que inclui uma mensagem detalhando o resultado.

Pode ser acessada através da requisição:
	```
	PUT: http://localhost:5000/api/UpdateCurrency?ApiKey=HURB_ChallengeBravo
	```

No corpo da requisição deve ser enviado os parâmetros descritos. Exemplo:
```
{
	"Name":"HURB",
	"PriceValue":2.0,
	"AutoUpdatePrice":false,
	"PriceCurrency":"BRL"
}
```

#### GetCurrency

Permite consultar uma moeda já registrada e retornar as informações sobre ela. Recebe como parâmetro apenas um campo:
- **Name**: O nome da moeda a ser consultada. Deve necessariamente coincidir com uma moeda existente na base e não pode estar vazio.

**Resposta**: Além dos campos padrões de Result e Status, retorna também todas as informações sobre uma determinada moeda descritos anteriormente: Name, contendo o seu nome, PriceValue, com o valor de uma unidade dela na moeda de lastro, e AutoUpdateValue, indicando se trata-se de uma moeda que tem seu valor atualizado automaticamente

Pode ser acessada através da requisição:

	GET: http://localhost:5000/api/GetCurrency?ApiKey=HURB_ChallengeBravo


Na chamada da url deve ser enviado o parâmetro descrito. Exemplo:


```
http://localhost:5000/api/GetCurrency?ApiKey=HURB_ChallengeBravo&Name=BRL
```

#### DeleteCurrency

Permite remove uma moeda adicionada anteriormente. Não pode ser usada para remover a moeda default de lastro (USD). 
Recebe como parâmetro apenas um campo:
- **Name**: O nome da moeda a ser consultada. Deve necessariamente coincidir com uma moeda existente na base e não pode estar vazio.

**Resposta**: Retorna apenas os campos padrões, ou seja, o booleano Result, indicando se a operação foi bem sucedida, e o campo Status, que inclui uma mensagem detalhando o resultado.

Pode ser acessada através da requisição:
	```
	DELETE: http://localhost:5000/api/DeleteCurrency?ApiKey=HURB_ChallengeBravo
	```

No corpo da requisição deve ser enviado o parâmetro descrito. Exemplo:
```
{
	"Name":"HURB"
}
```

#### ListCurrencies

Retorna uma lista contendo todas as moedas que foram adicioandas até então. Não precisa receber nenhum parâmetro.

**Resposta**: Retorna uma lista contendo todos os campos de informações de moedas descritos anteriormente para cada elemento encontrado: Name, PriceValue e AutoUpdateValue.

Pode ser acessada através da requisição:
	```
	GET: http://localhost:5000/api/ListCurrencies?ApiKey=HURB_ChallengeBravo
	```


### Conversão

#### ConvertCurrency

Permite realizar a conversão de um determinado valor entre duas moedas distintas. Recebe como parâmetro três campos:
- **From**: O nome da moeda na qual se encontra o valor original a ser convertido. Deve necessariamente coincidir com uma moeda existente na base e não pode estar vazio;
- **To**:  O nome da moeda na qual se deseja obter o valor final a ser convertido. Deve necessariamente coincidir com uma moeda existente na base e não pode estar vazio.
- **Amount**: O valor que deverá ser convertido durante a operação. Deve obrigatoriamente ser um número decimal acima de zero. Não pode estar vazio;

Pode ser acessada através da requisição:
	```
	GET: http://localhost:5000/api/ConvertCurrency?ApiKey=HURB_ChallengeBravo
	```

Na chamada da url deve ser enviado os parâmetros descritos. Exemplo:


```
http://localhost:5000/api/ConvertCurrency?ApiKey=HURB_ChallengeBravo&From=BRL&To=USD&Amount=1000
```

## Testes

Foram executados diversos testes manuais no decorrer do desenvolvimento para entender o funcionamento de cada um dos serviços e a integração entre eles. 

Por fim, foi utilizada a ferramenta **Jmeter** para realizar testes de estresses e entender como a aplicação iria funcionar sobre condições extremas.

## Detalhamento dos códigos

Foi utilizado um template de API gerado automaticamente pelo VisualStudio para servir de base ao projeto, portanto, nem todos os códigos aqui presentes foram escritos diretamente por mim. 

Os seguintes arquivos e pastas foram desenvolvidos especialmente para esse projeto:

- ConversionAPI/Controllers/ConvertController
- ConversionAPI/Controllers/CurrencyController
- Todos os arquivos na pasta ConversionAPI/Models (com exceção do ErrorViewModels)
- ConversionAPI/Validators
- SharedLibrary
- Arquivos Dockerfile e docker-compose
- No arquivo ConversionAPI/Startup foram feitas diversas modificações

