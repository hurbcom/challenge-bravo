# Challenge Bravo
[[Inglês](README.md) | [Português](README.pt.md)]

# Introdução
O projeto tem como objetivo prover uma API pública responsável pela conversão monetária (USD, BRL, EUR, ETH, BTC) que possuem uma moeda de lastro (USD), sendo possível criar, ler, atualizar e deletar moedas reais (FIAT), cryptos e fictícias.

![Default home view](screen-shot_api-home.png?raw=True "Title")

### Principais funcionalidades
* Conversão entre duas moedas (FIAT, Crypto ou Fictícia).

* Criação, leitura, atualização e deleção de moedas.

* Rotina de atualização automática dos valores reais das moedas.

# Começo rápido
Primeiro clone o repositódio do projeto do [Github](https://github.com/assisthiago/challenge-bravo) e entre no novo diretório:
```bash
$ git clone git@github.com:assisthiago/challenge-bravo.git
$ cd challenge-bravo
```

Crie um virtualenv para seu projeto na raiz do diretório e ative:
```bash
$ python3 -m venv .venv
$ source .venv/bin/active
```

Instale as dependências do projeto:
```bash
$ pip install -r requirements.txt
```

Depois, simplesmente rode as migrações:
```bash
$ python manage.py migrate
```

Copie o arquivo `.env-sample` do diretório `contrib/` para a raiz do projeto:
```bash
$ cp contrib/.env-sample .env
```

Agora você está pronto para rodar o servidor de desenvolvimento localmente:
```bash
$ python manage.py runserver
```

_OPCIONAL_. Caso queira incluir dados de forma rápida, simplesmente rode o comando:
```bash
$ python manage.py loaddata exchange/core/fixtures/currencies.json
Installed 7 object(s) from 1 fixture(s)
```

# Docker

Atualize o arquivo copiado `.env` para:
```
# DJANGO SETTINGS
DEBUG=True
ALLOWED_HOSTS=127.0.0.1, localhost
CACHE_TIMEOUT_IN_SECONDS=30
SCHEDULER_TIMEOUT_IN_MINUTES=1

# API
API_COINBASE_BACKED_TO_USD=https://api.coinbase.com/v2/exchange-rates/?currency=USD

# === DOCKER REQUIRED ===
# -- Comment these variables to run locally with `$ python manage.py runserver`
# -- Uncomment these variables to run locally with `$ docker-compose run --build`

# DATABASE
DATABASE_URL=postgresql://admin:1q2w3e4r@db:5432/development

# CACHE
CACHE_BACKEND=django.core.cache.backends.redis.RedisCache
CACHE_LOCATION=redis://cache:6379
```

Agora rode o comando do `docker-compose`:
```bash
$ docker-compose up --build
...
challenge-bravo-api-1    | System check identified no issues (0 silenced).
challenge-bravo-api-1    | December 19, 2022 - 14:56:04
challenge-bravo-api-1    | Django version 4.1.4, using settings 'exchange.settings'
challenge-bravo-api-1    | Starting development server at http://0.0.0.0:8000/
challenge-bravo-api-1    | Quit the server with CONTROL-C.
```

Abra o link [http://localhost:8000/](http://localhost:8000/) do projeto.

# Testes

### Unitários
```bash
$ python manage.py test
Found 56 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
........................................................
----------------------------------------------------------------------
Ran 56 tests in 1.593s

OK
Destroying test database for alias 'default'...
```

_OBSERVAÇÃO_. Não se esqueça de comentar as variávels do arquivo `.env` para rodar esses testes.
```
# DATABASE
# DATABASE_URL=postgresql://admin:1q2w3e4r@db:5432/development

# CACHE
# CACHE_BACKEND=django.core.cache.backends.redis.RedisCache
# CACHE_LOCATION=redis://cache:6379
```

### Estresse
Sigua as instruções para a instalação do [k6](https://k6.io/) e em seguida rode:
```bash
$ k6 run test_load_k6.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: test_load_k6.js
     output: -

  scenarios: (100.00%) 1 scenario, 1000 max VUs, 1m30s max duration (incl. graceful stop):
           * default: Up to 1000 looping VUs for 1m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)


running (1m18.1s), 0000/1000 VUs, 2904 complete and 0 interrupted iterations
default ↓ [======================================] 0735/1000 VUs  1m0s

     ✓ status was 200

     checks.........................: 100.00% ✓ 2904   ✗ 0
     data_received..................: 6.9 MB  88 kB/s
     data_sent......................: 945 kB  12 kB/s
     http_req_blocked...............: avg=161.29ms min=2µs      med=16µs   max=787.48ms p(90)=472.17ms p(95)=489.19ms
     http_req_connecting............: avg=51.95ms  min=0s       med=0s     max=270.63ms p(90)=153.91ms p(95)=158.73ms
     http_req_duration..............: avg=20.53s   min=167.41ms med=23.85s max=27.66s   p(90)=26.7s    p(95)=27.29s
       { expected_response:true }...: avg=20.53s   min=167.41ms med=23.85s max=27.66s   p(90)=26.7s    p(95)=27.29s
     http_req_failed................: 0.00%   ✓ 0      ✗ 2904
     http_req_receiving.............: avg=176.33µs min=21µs     med=106µs  max=4.89ms   p(90)=313.7µs  p(95)=478.84µs
     http_req_sending...............: avg=576.67µs min=8µs      med=53µs   max=126.72ms p(90)=514.5µs  p(95)=1.84ms
     http_req_tls_handshaking.......: avg=109.12ms min=0s       med=0s     max=617.14ms p(90)=314.55ms p(95)=331.88ms
     http_req_waiting...............: avg=20.53s   min=166.99ms med=23.85s max=27.66s   p(90)=26.7s    p(95)=27.29s
     http_reqs......................: 2904    37.163155/s
     iteration_duration.............: avg=21.69s   min=1.65s    med=24.86s max=28.66s   p(90)=27.7s    p(95)=28.29s
     iterations.....................: 2904    37.163155/s
     vus............................: 6       min=6    max=1000
     vus_max........................: 1000    min=1000 max=1000
```

_ATENÇÃO_. O _k6_ utiliza cerca de ~1-5MB por VU (usuário virtual). Nesse teste utilizamos 10000VUs (~1-5GB).


### Cobertura
```bash
$ coverage run --source='.' manage.py test && coverage report
Found 56 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
........................................................
----------------------------------------------------------------------
Ran 56 tests in 1.718s

OK
Destroying test database for alias 'default'...
Name                                                      Stmts   Miss  Cover
-----------------------------------------------------------------------------
contrib/__init__.py                                           0      0   100%
contrib/secret_gen.py                                         5      0   100%
exchange/__init__.py                                          0      0   100%
exchange/asgi.py                                              4      4     0%
exchange/coinbase/__init__.py                                 0      0   100%
exchange/coinbase/apps.py                                     8      0   100%
exchange/coinbase/schedulers.py                               8      0   100%
exchange/coinbase/tests.py                                    9      0   100%
exchange/coinbase/views.py                                   23      4    83%
exchange/core/__init__.py                                     0      0   100%
exchange/core/apps.py                                         4      0   100%
exchange/core/managers.py                                     4      0   100%
exchange/core/migrations/0001_initial.py                      5      0   100%
exchange/core/migrations/0002_alter_currency_options.py       4      0   100%
exchange/core/migrations/__init__.py                          0      0   100%
exchange/core/models.py                                      21      0   100%
exchange/core/serializers.py                                 28      0   100%
exchange/core/tests/__init__.py                               0      0   100%
exchange/core/tests/test_currency_convert_views.py           57      0   100%
exchange/core/tests/test_currency_detail_views.py            47      0   100%
exchange/core/tests/test_currency_list_views.py              72      0   100%
exchange/core/tests/test_models.py                           23      0   100%
exchange/core/tests/test_serializers.py                      57      0   100%
exchange/core/validators.py                                  24      0   100%
exchange/core/views.py                                       39      3    92%
exchange/settings.py                                         26      0   100%
exchange/urls.py                                              7      0   100%
exchange/wsgi.py                                              5      5     0%
manage.py                                                    12      2    83%
-----------------------------------------------------------------------------
TOTAL                                                       492     18    96%
```
