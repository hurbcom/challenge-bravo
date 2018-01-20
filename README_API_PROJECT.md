## 0. Considerações sobre a configuração do Dockerfile e criação do Container: 

:disappointed:

- Tentei seguir os steps para criação do container:
    - Criação do ```Dockerfile```;
    - Geração de uma imagem através do comando ```build``` - [[fonte - github Microsoft](https://github.com/Microsoft/dotnet-framework-docker-samples/tree/master/dotnetapp-4.6.2)];
    - Subir o container através do comando ```Run```.
    
- Após muitas tentativas de gerar a imagem (a partir do Dockerfile) no docker, a mensagem de erro abaixo foi exibida: 

<img src="https://github.com/nmaia/challenge-bravo/blob/develop/imgs/docker/erro_docker_build.png" />
    
- Tentei achar a solução através de pesquisas, mas não consegui solucionar o problema.
- **De qualquer forma, continuarei os estudos aqui sobre o docker para solucionar este problema!** :relaxed:

## 1. Anotações diversas:

- Pessoal, primeiramente me desculpem, sei que no [Readme.md](https://github.com/HotelUrbano/challenge-bravo/blob/master/README.md) do desafio vocês citam as tecnologias que tem mais afinidade, porém, optei por utilizar o Asp.Net C# por ser a tecnolgia que tenho maior nível de conhcimento atualmente. Em tempo, na entrevista com o [Zanaca](https://github.com/zanaca), fui informado de que poderia definir a stack a ser utilizada; :relaxed:
- A API do projeto está consumindo com sucesso os dados da API externa ([Coin Market Cap](https://coinmarketcap.com/api/)) e realizando a conversão de todas as moedas;
- Como a API externa não oferecia o resultado das conversões de moedas, tive que implementar toda a lógica com base nas informações disponibilizadas por esta API. Este ponto do projeto demandou bastante tempo até que a lógica de conversão fosse finalizada.
- Não foi pedido, mas achei interessante retornar a informação 'data de última atualização das cotações' para que o usuário tenha uma idéia de valor/tempo na hora de analisar as cotações.
- Na documentação da API (Swagger), identiquei um bug da ferramenta ([[fonte 1 - GitHub Issue](https://github.com/swagger-api/swagger-ui/issues/1983)] e [[fonte 2 - GitHub Issue ](https://github.com/metosin/compojure-api/issues/110)]). Para contornar este bug, deve-se passar a barra manualmente junto ao valor decimal, conforme evidência abaixo:

<img src="https://github.com/nmaia/challenge-bravo/blob/develop/imgs/swagger/erro_client_swagger.png" />

## 2. Formato para requisições via API do Projeto:

- ```/api/currencyConversion/getCurrenciesQuotation/{currencySymbol}```
- ```/api/convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}/```
 - ***Observações:*** 
    - *A segunda rota mencionada acima, está apresentando problemas quando é passado um número decimal com vírgula ( , ) e não com ponto ( . ). Estou decidindo o que é melhor, resolver isso no front ou transformar o decimal em string e realizar o tratamento no método de conversão de moedas da API.* -> ```Resolvido através de Regex e validações de form via front-end.```
    - *Outro ponto de observação/melhoria, é que esta rota mencionada no item anterior precisa que seja incluída a barra após o último parâmetro. As propostas de melhoria mencionadas acima podem resolver esta questão.*

## 3. Consumo e Retorno da API:

 - Método de conversão de moedas na API (disponível na camada de controllers): 
    ```csharp
    public async Task<HttpResponseMessage> Convert([FromUri] string fromCurrency, string toCurrency, decimal amount){ ... }
    ```
    
 - Retorno do método de conversão de moedas (em formato json):    
    ```json
    {
        "From_Currency": "USD",
        "To_Currency": "BRL",
        "Orinigal_Value": 4580.25,
        "Converted_Value": 14731.02,
        "Quotation_Last_Update": "16/01/2018 07:34:23"
    }
    ```
    
## 4. Tecnologias utilizadas na arquitetura do projeto (no lado da API/Back-end):
    
- **Simple Injector** (Para aplicar o conceito de Injeção de Dependência);
- Utilização do **pattern Facade** (Na camada Business);
- **NLog** (Lib para captura/armazenamento de logs durante o runtime da aplicação);
- Utilização do conceito de **URLs amigáveis** (Conforme mostrado no item 2 deste documento);
- **Métodos assíncronos** (Utilizando async/await);
- **AutoMapper** (Lib para mapeamento entre objetos, tornando mais prática a manipulação dos mesmos);
- **MS Test** (Lib para desenvolvimeneto de testes unitários).

## 5. Tecnologias utilizadas na arquitetura do projeto (no lado Front-end):

- **Angular JS 1.6**;
- **BootStrap CSS**;
