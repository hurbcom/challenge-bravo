# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> AppHurb

API REST construída em Python, nela você pode verificar valores de moedas, fazer conversões de valores entre diferentes moedas, adicionar e excluir moedas do banco de dados.

A API contém as seguintes moedas no banco de dados:

-   USD (Dólar Comercial)
-   BRL (Real Brasileiro)
-   EUR (Euro)
-   BTC (Bitcoin)
-   ETH (Ethereum)

E você pode adicionar as seguintes moedas:

- USDT (Dólar Turismo)
- CAD (Dólar Canadense)
- AUD (Dólar Australiano)
- GBP (Libra Esterlina)
- ARS (Peso Argentino)
- JPY (Iene Japonês)
- CHF (Franco Suíço)
- YLS (Novo Shekel Israelense)
- LTC (Litecoin)
- XRP (Ripple)

Obs: Como o lastro da API está em dólar americano, eu optei por deixar o a exibição dos valores no formato americano, onde o ponto substitui a vírgula na separação dos centavos.


Após clonar o projeto, siga os passos para instalar as dependencias e iniciar a aplicação, como o projeto foi desenvolvido usando python 3, é necessário ter essa versão do python instalada.

$ cd challenger-bravo
$ pip3 install -r requirements.txt
$ python3 appHurb.py

Obs: O projeto foi desenvolvido em ambiente virtual usando o venv, caso seja de sua vontade rodar o projeto usando o ambiente virtual, utilize o comando abaixo antes de instalar as dependencias:

$ source meuenv/bin/activate


Possíveis erros ao tentar instalar dependências e rodar a aplicação:

Para simular a instalação deste projeto em um sistema novo, fiz um boot do sistema operacional linux pelo pendrive, assim teria um sistema totalmente "virgem" para testes.
Primeiro instalei o python 3, o linux vem originalmente com python 2 instalado porém este está com os dias contados, porque será descontinuado pelo organização que mantém o Python.

$ sudo apt-get install python3

Depois precisei instalar o PIP, pois será através dele que instalaremos o as dependencias contidas no requirements.txt, ele pode ser instalado pelo comando abaixo:

$ sudo apt install python3-pip

Finalmente, ao tentar instalar as dependências seguindo o passo a passo deste documento, encontrei dois erros referentes a ferramentas do python 3 e que precisariam ser instaladas, possivelmente pelo fato de eu ter acabado de instalar o python 3 o sistema ainda não possuísse essas ferramentas, elas são o "sysconfig" e "setuptools".

Para a primeira,resolvemos isnstando com o comando:

$ sudo apt install python3-distutils

Para a segunda, resolvemos instalando com o comando:

$ pip3 install setuptools

Após isso, não tive mais erros e consegui iniciar a aplicação sem problemas.


Rotas de resposta da API:

>>>>Endpoint: http://127.0.0.1:5000/status/codigo_moeda

método HTTP: GET
Exemplo: /status/USD
Resposta: Retorna um JSON com informações atuais sobre a moeda escolhida, o valor da moeda tem como base o dólar comercial.


>>>>Endpoint: http://127.0.0.1:5000/codigo_moeda_origem/codigo_moeda_destino/valor

método HTTP: GET
Exemplo: http://127.0.0.1:5000/USD/BRL/100
Resposta: Retorna um JSON com o nome da moeda destino, a data em que foi atualizada e o valor da conversão entre as duas moedas.


>>>>Endpoint: http://127.0.0.1:5000/codigo_moeda

Método HTTP: POST
Exemplo: http://127.0.0.1:5000/CAD
Resposta: Adiciona a moeda passada como parâmetro ao banco de dados, e retorna uma mensagem de sucesso, caso tenha sido adiciona, ou de erro caso não tenha sido.


>>>>Endpoint: http://127.0.0.1:5000/codigo_moeda

Método HTTP: DELETE
Exemplo: http://127.0.0.1:5000/CAD
Resposta: Deleta a moeda passada como parâmetro e retorna uma mensagem de sucesso caso tenha sido deletada e de erro caso não tenha sido.


Escolhas técnicas para o projeto:

1- Atualmente trabalho como Front-End e utilizo o JavaScript, chegou a passar por minha cabeça desenvolver esta API usando NodeJS, porque essa tecnologia vem ganhando muito mercado e seria um bom aprendizado, porém Python é a linguagem com que tive mais afinidade até agora e é um grande desejo trabalhar usando essa linguagem, embora tivesse algum tempo desde que eu desenvolvia alguma coisa usando python.

2- Por gostar tanto de python escolhi usar o Flask como framework, primeiro por ser um framework que ja tinha estudado a um tempo atrás e por não gerar boilerplate code, dessa forma todo o código contido nos arquivos foi escrito por mim.

3- Escolhi o SQLite como banco de dados por ser um banco de dados que não precise instalar muitas bibliotecas para ser implementado e consegue ser facilmente rodado em qualquer sistema. No projeto eu utilizei o banco de dados como se fosse uma memória cache, toda vez que o servidor é iniciado uma função atualiza o banco de dados com os dados de uma API externa, todas as outras requisições feitas pela API são feitas para o banco, em um sistema real poderia ser criada uma rotina para atualizar o banco de tempo em tempo.

4