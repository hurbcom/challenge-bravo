# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="32" /> Desafio Bravo
  
Construção de uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API suporta  as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH

  
## Getting Started e Pré-Requisitos 

 - Essa aplicação foi escrita em Python **3.6.6**, inicialmente no Windows, e posteriormente foi portada e ajustada para o Linux. Ela **não executa no Python 2.7x** devido algumas diferenças de sintaxe. Atenção em máquinas com as duas distribuições instaladas (2.7x e 3+) pois executar o ***pip*** e o ***python*** sem o ***3*** na frente (***pip3*** ***python3***) resultará na instalação de pacotes e execução na versão antiga.
 
 - As bibliotecas utilizadas, além das internas do Python, são:

> **Flask** 
> **Flask_restful** 
> **Flask_Cors** 
> **requests** 
> **uWSGI**

 - Para instalação dos bibliotecas e dependências usadas nesse projeto,  executar ***pip install -r requirements.txt*** (Se houver as duas versões do Python na máquina usar ***pip3***)

 - Para executar a aplicação, **estando no diretório raiz** da mesma, basta executar os comandos no terminal:
		***cd src
		uwsgi --ini wsgi.ini***
    
    -A API está pronta para uso e consulta através da rota http://<endereço do host>**/api/convert** com QueryStrings 
    **base** (obrigatório): É a moeda de origem a ser convertida
    **target** (obrigatório): É a moeda a moeda esperada na conversão
    **value** (opcional): É o montante a ser convertido. Na ausência deste ou no valor 0, a API automaticamente assume o valor 1
    Exemplo:  
    http://<endereço do host>/api/convert**?base=EUR&target=BRL&value=150**
    http://<endereço do host>/api/convert**?base=USD&target=ETH**

Para facilitar o acesso a aplicação ainda continua hospedada no AWS Elastic Beanstalk (numa instância gratuita, t2.micro)
http://challengebravohurb.sa-east-1.elasticbeanstalk.com/  

## Testes de Software
O único teste implementado é um **teste de carga** contido na pasta **tests**.
Para executá-lo, basta executar ***python load_test.py*** dentro da pasta do arquivo para iniciar.

Inicialmente eu comecei usar o JMeter, para lançar os multiplos requests, mas achei muito lento pra fazer os requests. Preferi escrever meu próprio script em Python

Essa aplicação tem algumas limitações de performance. Ela utiliza o padrão WSGI (Web Server Gateway Interface) que serve como ponte entre o servidor e a aplicação permitindo a escalabilidade da aplicação através de callbacks do entrypoint da aplicação. A maioria deles são self-hosted, ou seja conseguem sozinhos servir a aplicação mas nem sempre são eficientes sozinhos necessitando de um Web Server de fato (como Apache, Nginx, IIS). ~~Como meu conhecimento de Apache e Nginx é praticamente nulo~~, passei 90% do tempo de desenvolvimento testando diversas bibliotecas de WSGI (uWSGI, Gunicorn, CherryPy, meinheld, wsgiref e muitas outras que nem se quer consegui instalar no pip como a Bjoern que nos gráficos comparativos prometia ser avassaladora nos requests concorrentes mas bleeh). Tentei inclusive fazer deploy no AWS Elastic Beanstalk que possui uma instancia pré configurada para rodar aplicações web Python em cima do Apache, mas só consegui com o wsgiref (biblioteca interna do Python) que não foi lá essas coisas o resultado (Também a instância gratuita deve ter o mesmo poder computacional de um Raspberry Pi 3, com apenas 1 GB de RAM e um CPU compartilhado). Até o momento, a mais eficiente e estável em self-hosted foi a uWSGI. Ainda sim não foi possível responder as 1000 requests em 1 segundo. O aplicação aguenta sem travar, baixo consumo de RAM e processamento no host, porém a resposta mais rápida que consegui foi na casa de 22ms e o tempo total de resposta de todas as responses é o mais rápido que alcancei aqui em casa foi de 2.8 segundos. Claro que há varias variáveis como por exemplo hardware, infraestrutura etc. Estava rodando os requests e o host em maquinas separadas, o host num notebook com Linux em Live no Pen Drive que deixa a performance bem reduzida além de eu não usar conexão com cabos, Wi-Fi tende a ter uma pequena latência maior natural.  Não faz diferença iniciar o server WSGI com 5 ou 50 workers (tipo threads/tasks) que não faz diferença na performance se não tiver um Web Server HTTP na frente pra distribuir esses requests. O CherryPi é um pouco mais rápido que o uWSGI porém algumas requests/responses falham. Então entre performance e confiabilidade, optei pela confiabilidade. Acredito que o com um HTTP Server na frente orquestrando os requestes para os workers a performance deve subir exponencialmente.  


<p  align="center">
<img  src="ca.jpg"  alt="Challange accepted"  />
</p>
