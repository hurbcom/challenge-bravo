# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

## 💻 Resumo do projeto

Este projeto foi realizado utilizando sem a utilização de um framework, todo código não originário das pastas vendors e db (templates gerados pelo phinx) é de minha autoria.

**Tecnologias:**

- Docker
- PHP 8
- Nginx
- SQLite

### 📑 Framework MVC e componentes

O sistema MVC foi desenvolvido com o auxilio do ecossistema de pacotes do PHP e utilizando os padrões da PSR de interfaces interoperaveis.

Com isso foi construído um sistema MVC simples e eficiente, onde o maior tempo de processamento (avaliado pelo profiler do xdebug com kcachegrid) se dá no autoloading do composer, mesmo após as [otimizações recomendadas pelo fornecedor](https://getcomposer.org/doc/articles/autoloader-optimization.md).

- [Laminas diactoros](https://docs.laminas.dev/laminas-diactoros/) - Responsável pela criação de Requisições e Respostas conforme o padrão [PSR-7](https://www.php-fig.org/psr/psr-7/) e fábricas de Respostas [PSR-17](https://www.php-fig.org/psr/psr-17/)
- [League Route](https://route.thephpleague.com/) - Interpretador de rotas, um wrapper para o [fastrouter](https://github.com/nikic/FastRoute) compatível com [PSR-7](https://www.php-fig.org/psr/psr-7/) e [PSR-15](https://www.php-fig.org/psr/psr-15/)
- [Laminas Http Request Handler Runner](https://docs.laminas.dev/laminas-httphandlerrunner/) - Emissor de respostas
- [php-di](https://php-di.org/) - Container de injeção de dependecias compatível com [PSR-11](https://www.php-fig.org/psr/psr-11/)
- [phinx](https://phinx.org/) - Sistema de migrações de banco de dados
- [monolog](https://github.com/Seldaek/monolog) - Sistema de logs padrão de mercado compatível com [PSR-3](https://www.php-fig.org/psr/psr-3/)
- [brick/math](https://github.com/brick/math) - Biblioteca de operações de cálculo de precisão arbitrária, é necessário uma vez que o php não lida bem com operações de ponto flutuante
- [symfony/cache](https://symfony.com/doc/current/components/cache.html) - Componente cache do symfony responsável por armazenar a requisição da API
- [phpunit](https://phpunit.de/) - Suite de testes automatizados da família xUnit

### 💱 API de Conversão

Rotas para API de conversão, as duas são sinônimos.

A requisição recebe como parâmetro: A moeda de origem, o valor a ser convertido e a moeda final.


| METODO | URL                                                  | EXPLICAÇÃO       |
|--------|------------------------------------------------------|------------------|
| GET    | /?from=BTC&to=EUR&amount=123.45                      | Converte cotação |
| GET    | /api/v1/converter?from=BTC&to=EUR&amount=123.45      | Converte cotação |

### 💲 API de Controle das moedas suportadas

Rotas para API de controle de moedas:

| METODO | URL                    | EXPLICAÇÃO                                |
|--------|------------------------|-------------------------------------------|
| GET    | /api/v1/currencies     | Lista moedas suportadas com suas cotações |
| GET    | /api/v1/currencies/ABC | Lista moeda ABC com sua cotação           |
| PUT    | /api/v1/currencies/ABC | Cria/Atualiza cotação de moeda ABC        |
| DELETE | /api/v1/currencies/ABC | Deleta moeda ABC                          |

* Obs: As APIs não foram protegidas em nível de aplicação pois acredita-se que em produção elas seriam protegidas à nível de borda (API Gateway).

#### Criando ou atualizando moedas suportadas

Ao utilizar **PUT /api/v1/currencies/ABC** deve se passar o valor fixado da moeda ou provedor em json das seguintes formas:

**Valor fixado**

```json
{
    "amount": 123
}
```

**Provedor**

```json
{
    "source": "open-exchange-rates"
}
```

## 🚀 Instalação

Para iniciar a aplicação é necessário copiar o arquivo **.env.example** para **.env**

```bash
# Instalação das dependencias/pacotes
./composer install -o --apcu-autoloader --no-dev

# Executando migrações de banco de dados e seeding
./phinx migrate
./phinx seed:run

# Inicia sistema na porta 80
docker-compose up -d
```

* Obs: Os comandos ./phinx, ./phpunit e ./composer são wrappers em bash para comandos em docker

## 🔨 Testes

Para rodar os testes

```bash
# Instalação das dependencias/pacotes
./composer install

# Executando a suite de testes
./phpunit
```

* Obs: Os comandos ./phinx, ./phpunit e ./composer são wrappers em bash para comandos em docker

## 🎯 Teste de carga

O teste de carga realizado utilizando JMeter constatou uma taxa de 300reqs/sec com a stack php-apache, ao trocar e configurar uma stack nginx/php-fpm a taxa foi para **1200reqs/sec**.
