
# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo
============================

## Sobre
Este é um projeto baseado no Desafio Bravo (https://github.com/hurbcom/challenge-bravo), o projeto foi desenvolvido em Node.js utilizando Express e Mongoose, e seu objetivo é realizar uma conversão monetária.
No caso deste projeto o Dólar é usado como base de conversão da moeda, utilizando a api da apiLayer (https://currencylayer.com/) para obter a cotação da moeda que é salva no banco de forma diária, onde só é requisitado quando a data que esta salva no banco é diferente da data atual.

## Instalando

Obs.: É necessário antes de instalar este projeto, ter instalado: 
* Docker e o Docker-compose

Para instalá-lo em sua máquina faça os comandos a seguir:

``` bash
  git clone https://github.com/jownn/challenge-bravo.git
  cd challenge-bravo
  docker-compose build
  docker-compose up
```

## Documentação da API

https://documenter.getpostman.com/view/5534231/SVtZv6Da?version=latest

#### Atenção

Para acessar no seu navegador o endereço é http://localhost:3000

## Teste

Um teste executado no end-point obteve os seguintes resultados:

Running 10s test @ http://localhost:3000/api/
  2 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    77.75ms   97.45ms   1.39s    97.52%
    Req/Sec     6.94k     1.81k    9.93k    73.74%
  136940 requests in 10.08s, 51.19MB read
  Non-2xx or 3xx responses: 136940
Requests/sec:  13584.56
Transfer/sec:      5.08MB

## Autor
Jonathan Souza Silva
Email: <jonathansouzasilva@hotmail.com>
