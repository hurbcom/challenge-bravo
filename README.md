#currency-converter

Conversor de moedas

## Executando a aplicação

Existem 3 diferentes maneiras para execuar a aplicação, explicarei cada uma delas.

## 1 - Rodar o dockerfile diretamente

### Pré requisitos

Possuir o docker instalado.

### Execução

1 - Construir a imagem do docker

```
docker build -t hu/currency .
```

2 - Rodar o comando

```
docker run -it \
    -p 8080:8080 \
    hu/currency

```


## 2 - Construção da imagem(docker) via Maven

### Pré requisitos

Possuir java8, maven 3+ e o docker instalado.

### Execução

1- Rodar o comando

```
mvn clean package dockerfile:build
```
2 - Após a execução do comando, será criada uma imagem no seu docker com o nome hu/currency-converter-app
Rodar o comando do docker para rodar a aplicação

```
docker run -it \
    -p 8080:8080 \
    hu/currency-converter-app

```

## 3 - Execução Direta

### Pré requisitos

Possuir o java8 instalado.

### Execução

1 - Dentro da pasta target do projeto

```
java -jar currency-converter-0.0.1-SNAPSHOT.jar 
```

## Rodando os testes

### Pré requisitos

Possuir o java8 e o maven 3+ instalados.

### Execução

```
mvn clean install
```

## Decisões e frameworks utilizados

Desenvolvimento foi em java, utilizando o spring-boot

O spring boot facilita a criação de APIs abstraindo a questão de compatibilidade de libs, contendo um servidor web já em sua estrutura (Pode ser alterado).
 
* [SpringBoot](https://projects.spring.io/spring-boot/)

Para conversões utilizei uma lib chamada javamoney
* [JavaMoney](http://javamoney.github.io/)


## TODO

Não foi realizado a conversão para BTC (Bitcoin).
A proposta para essa conversão seria, consultar de x em x tempos seu valor, pois é uma moeda bastante mutável, e armazenar isso em cache ou diretamente em memória RAM e realizar a conversão quando solicitado ou A lib do JavaMoney da a opção de criação de uma moeda, então poderiamos criar essa moeda pela lib após realizar a consulta.

OBS
A cotação do bitcoin tem variação de acordo com a moeda, por exemplo, não necessáriamente 1 dolar será o mesmo valor em bitcoin, do que o valor em reais que representa 1 dolar.

Segue um endpoint de consulta:

* [Cryptocurrency Market Capitalizations](https://coinmarketcap.com/api/)


## Construido com

* [Maven](https://maven.apache.org/) - Dependency Management

