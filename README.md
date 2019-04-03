# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve converter entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:
- JavaScript (NodeJS)
- Python
- Go
- Ruby
- C++
- PHP

Você pode usar qualquer _framework_. Se a sua escolha for por um _framework_ que resulte em _boilerplate code_, por favor assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.

## Requisitos
- Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um *pull request*.
- O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
- Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
  - git clone $seu-fork
  - cd $seu-fork
  - ~~comando para instalar dependências~~
  - comando para executar a aplicação: **Apenas executar docker-compose up na raiz do projeto**
- A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.



## Critério de avaliação

- **Organização do código**: Separação de módulos, view e model, back-end e front-end  
  O código ficou simples dada a simplicidade da solução
- **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?  
  Sim.
- **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?  
  Sim. Atende os requisitos solicitados.
- **Legibilidade do código** (incluindo comentários)  
  Pela simplicidade dos objetos e do desafio, os métodos ficaram autoexplicativos não necessitando de comentários
- **Segurança**: Existe alguma vulnerabilidade clara?  
  A versão atual do pacote mocha apresenta uma vulnerabilidade em uma de suas dependências: js-yaml. Será corrigida na versão 6.1.0, a atual é a 6.0.2. Coloquei uma forma de forçar a atualização deste pacote vulneravável na rotina de pre-install.
- **Cobertura de testes** (Não esperamos cobertura completa)  
  Não sei o número exato que ficou, pois não cheguei a rodar o istanbul. Porém poderia ser um pouco falho, pois estou compreendendo todos os métodos expostos e acredito que os principais cenários de validação, que a ferramenta não conseguiria mapear.
- **Histórico de commits** (estrutura e qualidade)  
 Ficaram apenas três commits pois parti de um projeto base que já possuia express + mongoose. Depois criei os outros commits para os tests e docker.
- **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?  
  Sim.
- **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?  
  As bibliotecas sim, porém já vi performances melhores utilizando Go. Decidi fazer por node por ter mais familiaridade e por isso ser mais produtivo. O banco de dados suporta se a aplicação, mas não recomendo a utilização de banco de dados em containers para ambientes de produção. Os bancos possuem algoritmos otimizados para leitura e escrita em disco, quando se trata da virtualização dos mesmos, isto pode gerar perda de performance e até mesmo falhas em alguns cenários. Quanto a arquitetura, o serviço vale a pena manter conteinizado para uma melhor escalabilidade, mas quanto ao BD utilizaria numa infra externa.

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HotelUrbano/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
