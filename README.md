# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

Desafio Bravo é uma API desenvolvida para o Desafio Bravo da empresa Hurb que realiza a conversão monetária de diversas moedas diferentes, sendo elas moedas reais ou moedas fictícias criadas por um usuário. 
Esta API foi desenvolvida em Python utilizando principalmente o framework **FastAPI** e tem como requisitos:
-   Suportar até 1000 requests por segundo;
-   Converter o valor de moedas, sendo elas reais ou criadas;
-   Permitir a criação de novas moedas para suporte;
-   Permitir que o usuário apague moedas do suporte;
-   Permitir que o usuário crie moedas imaginárias para conversão;
-   Exibir valores atuais das moedas;


## Instalação e Execução
Para instalar e executar a aplicação o usuário:
1. Clonar este repositório;
2. Rodar via linha de comando o script: `./install.sh`
3. Rodar via linha de comando o script: `sudo docker run --network="host" conversor_de_moedas:latest`

Vale notar que, conforme explicado depois na documentação a instalação sobe em um docker um servidor redis para uso pela aplicação

## Escolhas de Projeto
Uma das escolhas principais do projeto foi o uso do Redis para persistência de informação. Tal escolha foi feita principalmente para que a API conseguisse acessar mais rápida os valores convertidos de cada moeda. Um Banco de Dados Relacional não foi utilizado para que o projeto não tivesse sua complexidade aumentada ainda mais. Vale notar que caso os requisitos da aplicação sejam modificados para que ela englobe uma maior complexidade se faz necessário avaliar novamente a necessidade de se usar um Banco de Dados Relacional em conjunto com a aplicação. 
Outra das escolhas feitas foi a utilização do framework **FastAPI**. Tal escolha foi feita pois esse framework é otimizado para uma grande quantidade de requests e é de simples utilização, sem contar que ele cria automaticamente um Swagger como documentação caso configurado corretamente.
Como última decisão de projeto a se destacar, se faz necessário observar a criação de dois dockers diferentes no projeto:
1. base_image;
2. conversor_de_moedas;

Tal escolha foi feita para que outros projetos pudessem utilizar a mesma imagem python em outras circunstâncias. A imagem **base_image** também foi criada pois existe uma limitação na quantidade de pulls realizados diretamente ao DockerHub por IP, algo que impede o uso dessas imagens de forma simples em aplicativos de CI/CD, como o CodePipeline ou Jenkins. Uma das melhores formas de contornar o problema é criando uma imagem privada cópia da imagem pública no DockerHub. A outra solução possível é ter uma conta paga no DockerHub para que o número de pulls permitidos seja maior.

### Considerações
Para que o projeto fosse de fácil visualização e avaliação, foram colocados no repositório git arquivos contendo as senhas utilizadas no projeto. Dito isso, todas estas informações estão sendo usadas em todos os momentos do código via variáveis de ambiente, visando o uso de ferramentas como o **Secrets Manager** da AWS na sua utilização em ambiente de produção.

## Testes
Para avaliar o funcionamento da API foram criados diversos testes unitários contidos no arquivo `tests/main_test.py`.
Já para avaliação do teste de carga do aplicativo foi utilizada a aplicação **JMeter**. Tanto a aplicação como a configuração utilizada para o teste de carga estão inclusos na pasta `load_tests`
