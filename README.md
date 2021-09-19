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

Vale notar que, conforme explicado depois na documentação a instalação sobe em um docker um servidor redis para uso pela aplicação.
Também é importante notar que os comandos de docker foram escritos com o uso de sudo para que não haja nenhum problema de permissão na sua execução.

## Escolhas de Projeto
Uma das escolhas principais do projeto foi o uso do Redis para persistência de informação. Tal escolha foi feita principalmente para que a API conseguisse acessar mais rápida os valores convertidos de cada moeda. Um Banco de Dados Relacional não foi utilizado para que o projeto não tivesse sua complexidade aumentada ainda mais. Vale notar que caso os requisitos da aplicação sejam modificados para que ela englobe uma maior complexidade se faz necessário avaliar novamente a necessidade de se usar um Banco de Dados Relacional em conjunto com a aplicação. 
Outra das escolhas feitas foi a utilização do framework **FastAPI**. Tal escolha foi feita pois esse framework é otimizado para uma grande quantidade de requests e é de simples utilização, sem contar que ele cria automaticamente um Swagger como documentação caso configurado corretamente.
Como última decisão de projeto a se destacar, se faz necessário observar a criação de dois dockers diferentes no projeto:

1. base_image;
2. conversor_de_moedas;   

Tal escolha foi feita para que outros projetos pudessem utilizar a mesma imagem python em outras circunstâncias. A imagem **base_image** também foi criada pois existe uma limitação na quantidade de pulls realizados diretamente ao DockerHub por IP, algo que impede o uso dessas imagens de forma simples em aplicativos de CI/CD, como o CodePipeline ou Jenkins. Uma das melhores formas de contornar o problema é criando uma imagem privada cópia da imagem pública no DockerHub. A outra solução possível é ter uma conta paga no DockerHub para que o número de pulls permitidos seja maior.
A terceira escolha de projeto foi fazer com que a captação do valor atualizado das moedas fosse feito em uma rotina apartada do servidor que roda de tempos em tempos para obter a nova cotação. Isso foi feito para que cada request de conversão não tivesse que acessar a API externa de cotação em todo o request. Tal solução seria ineficiente. Á conversão da cotação de cada moeda para cada moeda também foi calculada nessa rotina para diminuir ao máximo o número de operações necessárias na execução do request de conversão e reduzir ao máximo o número de "hot keys" no Redis.
A última escolha importante de se ressaltar é que para solucionar a situação de suporte para moedas imaginárias foi criada uma rota que permite ao usuário o upload de um arquivo python. Esse arquivo python deverá conter uma subclasse da classe `CustomCurrencyAbstract` e implementar seus métodos abstratos. Tal decisão foi tomada pois seria impossível dar suporte para diversas moedas imaginárias com meios diferentes de obtenção de seu valor convertido, sendo assim, cabe ao usuário implementar a lógica necessária para tal fim.   
Essa solução para o suporte de moedas imaginárias pode ser considerada parcialmente como uma falhas de segurança pois qualquer usuário que tenha acesso ao x-api-key do aplicativo consegue subir qualquer tipo de código desde que ele siga os moldes da classe `CustomCurrencyAbstract`. Para resolver tal problema, seria possível criar uma segunda x-api-key feita apenas para dar permissão a esse métodos e apenas pessoas que tenham permissão de modificar o método a possuiriam.

### Considerações
Para que o projeto fosse de fácil visualização e avaliação, foram colocados no repositório git arquivos contendo as senhas utilizadas no projeto. Dito isso, todas estas informações estão sendo usadas em todos os momentos do código via variáveis de ambiente, visando o uso de ferramentas como o **Secrets Manager** da AWS na sua utilização em ambiente de produção.

## Testes
Para avaliar o funcionamento da API foram criados diversos testes unitários contidos no arquivo `tests/main_test.py`.
Já para avaliação do teste de carga do aplicativo foi utilizada a aplicação **JMeter**. Tanto a aplicação **JMeter** como a configuração utilizada para o teste de carga estão inclusos na pasta `load_tests`

## Documentação
Para acessar o Swagger da API, basta-se acessar a rota `/docs` da mesma
