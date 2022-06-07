# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

### Rotas:

```
v1/convert/from=OF&to=TO&amount=AMOUNT/
```

Onde:

* OF: Origem

* TO: Destino

* AMOUNT: Valor a ser convertido

### <strong>Instruções para instalação</strong>:

#### Criar e ativar ambiente virtual Python (venv):

```python -m venv .venv```

```source .venv/bin/activate```

#### <strong>Instalar dependências</strong>:

```pip install -r requirements.txt```

#### <strong>Instalar dependências, inclusive de desenvolvimento</strong>:

```pip install -r requirements-dev.txt```

#### Copiar variáveis de ambiente:

```cp contrib/env-sample .env```

#### Rodar Servidor Django:

```python manage.py runserver```

### TODO:

* API-CRUD Moedas