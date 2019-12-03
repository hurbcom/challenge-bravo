# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## API

A Api foi criada para retornar valores de conversão de moedas com valores reais e atualizados.

## ROTAS

-   **/converter** -- Método GET -- Parâmetros ('from' (string/obrigatório), 'to' (string/obrigatório), 'amount' (nnumérico/obrigatório)) -- Rota que faz a conversão entre as moedas


-   **/coins**     -- Método GET -- Sem parâmetros -- Rota que busca as moedas cadastradas na API 


-   **/coins**     -- Método POST -- Parâmetros ('coin' (string/obrigatório) OBS: Sigla real de moeda válida (validação por API)) -- Rota que cadastra nova moeda na API


-   **/coins**     -- Método DELETE -- Parâmetros ('id' (string/obrigatório)) -- Rota que deleta a moeda selecionada


## RUN

- cd challenge-bravo
- npm install
- npm start