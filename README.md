### Sobre o projeto

O principal objetivo desta API desenvolvida em Python, é fazer conversões entre diferentes moedas com cotações de verdade e atuais.

Para quais moedas a API tem suporte e faz a conversão?
- BRL
- USD
- ETH
- BTC
- EUR 

O projeto é divido em dois microprocessos.
- [Crawler](https://github.com/iamgilvan/challenger-bravo/tree/master/Crawler)
- [bravoAPI](https://github.com/iamgilvan/challenger-bravo/tree/master/bravoAPI)

1. Crawler
    - Esse processo faz uso da API disponibilizada pela [CryptoCompare](https://www.cryptocompare.com/), que acompanha em tempo real a cotações das moedas.
     O processo simplesmente, de tempos em tempos, faz uma requisição na API da [CryptoCompare](https://www.cryptocompare.com/), guarda a data da requisição e insere no banco de dados.
O banco de dados utilizado é o provido pelo [mLab](https://mlab.com/) *MongoDB NoSQL* e o modo de uso deste processo pode ser encontrado [aqui](https://github.com/iamgilvan/challenger-bravo/tree/master/Crawler). 
É importante ressaltar que este processo sempre esteja rodando para que seja visualizada a cotação mais recente e no futuro possibilitar uma melhor qualidade dos dados ao extrair métricas.

2. bravoAPI
    - Esta aplicação é a que faz a conversão dos valores, ela recebe como parâmetros de entrada a moeda de origem, a moeda de destino e o valor para ser convertido. Após isso, acessa as informações no banco dados efetua seu processamento e retorna as informações para o cliente.
    Seu modo de uso pode ser encontrado [aqui](https://github.com/iamgilvan/challenger-bravo/tree/master/bravoAPI).


#### Pontos de melhorias
- Adicionar um novo parâmetro em que possibilite o usuário optar pela conversão do câmbio comercial ou turismo.
- Desenvolver testes automatizados
- Enviar um alerta(email) quando o crawler não foi executado com sucesso.
- Criar métricas da performace da API utilizando o [Datadog](https://www.datadoghq.com/) para monitoramento.
- Estudar a possobilidade de colocar ambos os processos nas plataformas [AWS Lambda](https://aws.amazon.com/lambda/) ou [Azure Funtions](https://azure.microsoft.com/en-us/services/functions/), diminuindo assim o custo e tornando os processos altamente escalável.
- Criar um relatório sazonal utilizando a bibliotaca [Matplotlib](https://matplotlib.org/) permitindo a visualização em gráficos a variação da moeda.

#### Tecnologias e ferramentas utilizadas
- [Python](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/)
- [Flask](http://flask.pocoo.org/)
- [Postman](https://www.getpostman.com/)
- [Heroku](https://www.heroku.com)