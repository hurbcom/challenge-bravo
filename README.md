# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24"/> Desafio Bravo

API construída em resposta ao desafio Bravo. Sua função é fazer conversões monetárias com retorno JSON.
A intenção é demonstrar arquitetura seguindo padrões SOLID, de fácil manutenção, escalabilidade, testável, dockerizavel e com desempenho superior ao exigido na proposta.
A linguagem escolhida foi C#. Caso eu utilizasse a stack sugerida no desafio talvez eu entregasse um produto simples e possivelmente com desempenho aquém do que este oferece.

# Objetivos
- Implementar o back-end da aplicação
- Implementar testes de unidade (xUnit)
- Implementar uma  solução para o problema de 1000 request por segundo

# Tecnologias
- Dotnet Core C#
- Redis
- MySql
- xUnit
- Docker
- HangFire

# Sobre a Infraestrutura de início automatizada
Para subir toda a aplicação basta executar o scrip setup_Currency.PS1 (Windows) ou setup_Currency.SH (Linux).
O script executa os testes unitários presentes na camada de Teste.
Ao finalizar a subida pro Docker a aplicação cria suas tabelas automaticamente se baseando na camada de Domínio.
São gravadas as moedas iniciais conforme sugerido pelo desafio (USD, BRL, EUR, BTC, ETH), ao mesmo tempo que seus valores atuais são buscados pela integração externa.
Após atualização dos valores de cada moeda, eles são enviados ao cache.
Uma tarefa recorrente para atualização dos preços de cada moeda é criada baseada no tempo em minutos contido no domínio de configuração (a cada 20 minutos).
Ao final temos 3 PODs (Banco, Cache e API)

# Instalação e execução da aplicação
Para instalar a aplicação pela linha de comando:

- **com docker**
    - Clone o repositório: `git clone https://github.com/carvrodrigo/challenge-bravo.git`
    - Acesse a pasta `cd challenge-bravo`
    - Inicie instalação em `setup_Currency` (.ps1 ou .bs)
  
- **sem docker**
    - Clone o repositório: `git clone https://github.com/carvrodrigo/challenge-bravo.git`
    - Acesse a pasta `cd challenge-bravo`
    - Instale a dependência `dotnet core runtime 2.1`
    - Inicie instalação em `setup_Currency` (.ps1 ou .bs)

# Testes manuais
Os testes rodam automaticamente ao iniciar a instalação automatizada. Os resultados são exibidos em tela. Caso seja necessário rodar novamente:
- Na pasta da aplicação, digite: `Dotnet test CurrencyConverter.Tests/CurrencyConverter.Tests.csproj`

# Endpoints da API
A API por padrão estará rodando na porta 8090, seus endpoints são:

### Conversor de moedas

- `GET` converte entre as moedas sugeridas via parâmetro.
Parâmertros: 
    - MoedaOrigem: Moeda inicial que irá ser convertida (Ex.: BRL).
    - MoedaDestino: Moeda Final que receberá a conversão (Ex.: EUR).
    - Valor: Montante em moeda inicial para ser convertido, (Ex.: 1,99). Os valores não inteiros devem utilizar ',' para parte decimal.
    - Exemplo completo: localhost:8090/Converter?from=BRL&to=EUR&amount=1,99
    
    http://localhost:8090/Converter?from={MoedaOrigem}&to={MoedaDestino}&amount={Valor}

### Diagnostico e Hearthbeat

- `GET` útil para Kubernetes e clusters, mostra a saúde da API e roda um check para todos os sistemas:
    http://localhost:8090/Diagnostics
Resposta:
```
{
    "system": "Is system fully alive?",
    "date": "2020-06-04 10:03:56",
    "external_integration": true,
    "background_worker": true,
    "cache_server": true,
    "database": true
}
```

### Adicionar, Remover ou exibir moedas

- `POST` para adicionar uma moeda, usando o corpo: "USD".
    http://localhost:8090/Currency

- `DELETE` para remover uma moeda, usando o nome da moeda: "USD".
    http://localhost:8090/Currency

- `GET` para receber todas as moedas cadastradas.
    http://localhost:3000/Currency

# Teste de carga
Foi utilizado o Artillery para realizar o estresse na API no endpoint de conversão. 
O conversor de moedas está buscando diretamente no cache para realizar os cálculos.
Devido ao cache a performance ultrapassou a marca de 1000 req/s. Em todos os testes a API respondeu 200.
Os seguintes testes foram realizados:

**Teste 1)** 1.000 requests/s durante 60 segundos (total: 60.000)
    Resposta na máquina 1 (windows de alta performance): 1000 processados por segundo (tempo de processamento: 1min)
    Resposta na máquina 2 (linux xubuntu doméstica de baixa desempenho): 1000 processados por segundo (tempo de processamento: 1min)
 
**Teste 2)** 6.000 requests/s durante 60 segundos (total: 360.000)
    Resposta na máquina 1: 1180/s (tempo: 5min:10sec)
    Resposta na máquina 2: 1509/s (tempo: 3min:55sec)

# Melhorias

 - Implementar segurança na parte administrativa.

# Dúvidas
Estou disponível para qualquer dúvida ou sugestão.

Rodrigo Dias de Carvalho -
carvrodrigo@gmai.com


<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
