# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Esta aplicação foi construída em NodeJS e faz conversões monetárias.

O que me levou a escolher NodeJS foi que eu nunca havia desenvolvido uma aplicação em nessa tecnologia. Me pareceu uma ótima oportunidade para experimentar construir uma aplicação de back-end.

Meus objetivos foram:

- implemetar o back-end da aplicação
- implementar uma documentação básica (swagger)
- implementar testes de unidade no node (mocha + chai)

Considero que um dos maiores problema enfrentados foi conseguir utilizar cotações atualizadas e manter a mais alta performance possível, para tentar atender ao requisito que diz que a aplicação deve suportar 1000 requests por segundo. Como requisitar as cotações a cada request recebido tornaria isso impraticável, minha solução foi buscar e carregar em memória cache as cotações logo ao iniciar a aplicação no servidor, antes de receber o primeiro request.

Para manter-las atualizadas, a cada request o servidor checa se a data das cotações é válida. Caso ela esteja expirada, a api responde uma mensagem "aguarde, atualizando cotações", e faz a atualização automaticamente. Isso faz com que eu sacrifique um request por dia, mas mantenha as informações em dia.

## Executar a aplicação
Para executar a aplicação pela linha de comando:

- **sem docker**
  - clone o repositório: `git clone https://github.com/vinas/challenge-bravo.git`
  - acesse a pasta `cd challenge-bravo`
  - instale as dependências `npm install`
  - levante a aplicação `npm start`

- **com docker**
  - clone o repositório: `git clone https://github.com/vinas/challenge-bravo.git`
  - acesse a pasta `cd challenge-bravo`
  - ajuste o valor da propriedade `WORKDIR`no arquivo `Dockerfile` para a pasta atual
  - builde o docker `docker build -t challenge-bravo .`
  - rode o docker `docker run -p 3000:3000 -d challenge-bravo:latest`

## Executar os testes
Para executar os testes pela linha de comando:

- certifique-se de que a aplicação está rodando (passos acima)
- na pasta da aplicação, digite `npm test`

## Finalmente

O resumo dos end-points estará disponível no endereço `http://localhost:3000`.

As moedas aceitas podem ser vistam em `http://localhost:3000/rates`.

Para acessar o swagger, `http://localhost:3000/documentation`;


## Dúvidas
Estou disponível para qualquer dúvida ou sugestão. =)

Vinas - 
vinas.andrade@gmail.com

