# Challenge Bravo - André Nicácio

## Descrição do Projeto

O Challenge Bravo é uma API desenvolvida para conversão de moedas, utilizando o dólar como base para as conversões. O projeto é implementado em JavaScript (NodeJS) e estruturado utilizando o Docker. Optamos por essas ferramentas devido à necessidade de atualizações constantes dos valores das moedas no banco de dados e para criar uma API estável que facilite futuros deployments.

### Tecnologias Utilizadas

- **NodeJS**: Linguagem principal para o desenvolvimento da API.
- **Docker**: Utilizado para gerar a estrutura da API, facilitando atualizações e futuros deployments.
- **Nginx**: Utilizado para fazer o balanceamento das requisições, dentro da estrutura de escalabilidade horizontal.
- **MongoDB**: Escolhido como banco de dados devido à capacidade de armazenamento dinâmico de dados, atendendo à necessidade de flexibilidade ao lidar com códigos.
- **Redis**: Empregado para controle de cache, reduzindo demandas no banco de dados e mitigando possíveis gargalos.
- **Swagger**: Implantado para documentação de rotas da API.

## Instalação e Execução do Projeto

Para instalar e executar o projeto, siga estes passos:

1. Certifique-se de estar no diretório raiz dentro da pasta da API.
2. Execute o seguinte comando Docker:

   ```bash
   docker-compose -f "docker-compose.yml" up -d --build
   ```

   Observação: Certifique-se de que este comando seja executado no mesmo nível do arquivo `docker-compose.yml` ou forneça o caminho correto para o arquivo. Toda alteração feita no códiga será necessário executar o comando novamente para integração.

Após a execução do comando, a documentação da API estará disponível em [http://localhost:8082/api-docs/#/]. As rotas estarão operacionais após a execução do comando Docker.

## Acessando o Container Docker

Para acessar o container Docker criado para a API, utilize os seguintes comandos:

1. Visualize os containers ativos:

   ```bash
   docker ps
   ```

2. Obtenha o ID do Container do serviço ativo chamado 'challenge-bravo-api'.

3. Execute o seguinte comando, substituindo `CONTAINER_ID_` pelo ID do Container obtido:

   ```bash
   docker exec -it CONTAINER_ID_ bash
   ```


## Exemplos de rotas - COINS

- **GET**: http://localhost:8082/coins/prod/convert?from=MOEDA_ORIGEM&to=MOEDA_DESTINO&amount=VALOR_A_CONVERTER
- **POST**: http://localhost:8082/coins/prod/insert (NECESSÁRIO API TOKEN)

    ```json
    {
        "code": "DD",
        "name": "Dungeons&Dragon",
        "value": "760.85"
    }
- **PUT**: http://localhost:8082/coins/prod/update (NECESSÁRIO API TOKEN)

    ```json
    {
        "code": "DD",
        "name": "Dungeons&Dragon-UPDATE",
        "value": "7.60"
    }
- **DELETE**: http://localhost:8082/coins/test/delete/DD (NECESSÁRIO API TOKEN)

## Rota para geração de TOKENS API
- **AUTENTICATION**: http://localhost:8082/autentication/generate (ESSE TOKEN EXPIRA APÓS 1 HORA)

Observação: As variaveis de ambiente se encontram no arquivo "docker-compose.yml" 

## Executando testes unitários/integração:
Uma vez dentro do container é possivel executar os comandos de testagem
- **UNITÁRIOS&INTEGRAÇÕES**: npm test

## Executando teste de estresse:
- **ESTRESSE**: 
Nesta API foi utilizado a biblioteca "Artillery" para testes de estresse:

1. Na pasta raiz do projeto, fora do container. Instale a biblioteca Artillery:

   ```bash
   npm install -g artillery
   ```

3. Execute o seguinte comando na raiz do projeto (Fora Container Docker), para iniciar o teste:

   ```bash
   artillery run artillery.yaml
   ```    
    
Observação: O teste de estresse aplicado pela biblioteca Artillery tem como padrão a latencia de mil (1000) requisições em um segundo (1s). 

## Conclusão

Obrigado pela oportunidade! Me dediquei bastante para mostrar meu conhecimentos e principalmente do que sou capaz, de aprender conforme as necessidades apontam e a curiosidade direciona. Me diverti fazendo este desafio e certamente aprendi coisas novas que vou aplicar em meu trabalho! Estarei na torcida e aguardando o feedback, grato pela atenção 😊
