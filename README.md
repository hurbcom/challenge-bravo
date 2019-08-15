# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Realizei o teste utilizando o PHP por maior conhecimento e afinidade com a linguagem.

Como era uma API, não me preocupei em fazer uma view para o teste, já que não tive nada consumindo essa API além do postman.

No arquivo principal está a rota da API que contém validações dos parâmetros, instanciação da classe e chamadas para os métodos que fazem a conversão.

Como queria um código mais rápido e tranquilo de se fazer, utilizei o slim framework na versão 2, pois não precisava de um framework muito robusto já que o teste era só uma api simples, e o slim se encaixa perfeitamente nisso, leve, fácil de instalar e de usar.

Fiz um arquivo de classe, que é aonde se encontra método de validação de moedas, baseado em uma constante com as moedas que foram passadas no teste e suas respectivas cotações que foram do dia 13/08/2019. Além dos métodos de conversão, tentei pensar em uma lógica diferente mas por falta de tempo acabei optando por uma lógica de converter o valor primeiro pra real e depois converter para a moeda de destino, acabou deixando o código mais curto. Adicionei só por capricho um método que adiciona o símbolo e o formato da moeda no final.

E uma classe de teste usando o PHPUnit, com assert de tipo de valor retornado e o valor final.

Para iniciar a API, basta ter algum software que suba um servidor php local, como por exemplo o Wamp Server. Depois de instalar o Wamp, basta colocar a pasta do projeto dento de __diretorio_de_instalacao\wamp64\www e iniciar o servidor do Wamp. Basta usar http://localhost/challenge-bravo/?from=BTC&to=EUR&amount=123.45 que a API responderá.

Foi adicionado uma collection do postman na versão 2.1 no projeto.

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
