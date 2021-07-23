  
<h1>
     <a href="hurb.com"><img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Logo Hurb" width="24" /></a>
     <a href="https://github.com/hurbcom/challenge-bravo"> Desafio Bravo </a>
</h1>

<p>
 <img alt="Made with go lang" src="https://img.shields.io/badge/Made%20with-Go-1f425f.svg">
   <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/gustavowiller/challenge-bravo?color=%2304D361">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/gustavowiller/challenge-bravo">
   <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>



## 💻 Descrição

Desenvolvimento de uma API que realiza conversão monetária de diferentes moedas com cotações de verdade e atuais.



## 🚀 Como rodar a aplicação



### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Docker](https://docs.docker.com/), [Docker Compose](https://docs.docker.com/compose/)


####  Configurando com o docker

```bash

# Clone este repositório
$ git clone https://github.com/gustavowiller/challenge-bravo

# Acesse a pasta do projeto no terminal/cmd
$ cd challengebravo

# Comando para copiar o arquivo template de configuração de variaveis de ambiente
$ cp .env-example .env

# Comando para iniciar os containers da api através do docker-compose
$ docker-compose up -d

# Por padrão o servidor iniciará na porta :8080

```



## 🛠 Tecnologias

As principais ferramentas utilizadas no desenvolvimento:
- [Go](https://golang.org/doc/)
- [Mysql](https://dev.mysql.com/doc/)

As bibliotecas externas do ecossistema de Go, que auxiliaram no desenvolvimento:
- [gin web framework](https://github.com/gin-gonic/gin) 
- [gorm](https://gorm.io/docs/index.html)
- [godotenv](https://github.com/joho/godotenv)
