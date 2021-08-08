# Backlog

## Backlog do Desafio HURBCOM - Challenge Bravo :zap: :hammer: :construction:

### Ações executadas, em ordem, durante o desenvolvimento da API do desafio

- Criar pastas e arquivos básicos de ambiente
- Criar virtualenv localmente (python3.9)
```shell
$ pip3 install --upgrade pip
$ pip3 install virtualenv
$ virtualenv venv/
```
- Instalar dependências do python
```shell
$ source venv/bin/activate
$ pip3 install -r requirements.txt
```
- Criar API na raiz do projeto pelo Django
```shell
$ django-admin startproject api
```
- Migrar DB inicial
```shell
$ python3 api/manage.py migrate
```
- Criar super usuário para que o Django crie uma estrutura de acesso inicial
```shell
$ python3 api/manage.py createsuperuser
# - user: rodrigo
# - pass: 87654321
```
- Criar APP Django Currency
```shell
$ python3 api/manage.py startapp currency
```
- Configurar Currency APP
- Testar servidor localmente
```shell
$ python3 api/manage.py runserver
```
- Abrir no browser o endereço [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

- Criar os modelos
  - Currency
  - CurrencyExchange
- Migrar modelos recém criados
```shell
$ python3 api/manage.py makemigrations
$ python3 api/manage.py migrate
```
- Registrar os modelos no admin.py
- Testar modificações localmente
- Adicionar para teste de funcionalidade o Real - BRL e o Dólar Americano - USD
- Criar os serializers dos modelos
- Criar e executar os testes dos modelos
```shell
$ python3 api/manage.py test
```
- Criar as views dos modelos
- Criar as rotas para as views dos modelos
- Criar a view responsável por retornar o cálculo do câmbio entre duas moedas de acordo com um montante específico
- Criar o Adapter responsável por retornar os dados de moeda e câmbio de uma API externa
- Criar as rotas para a view acima
- Criar teste para a rota principal da view acima
- Testar configuração de ambiente Docker
```shell
$ make compose
```
- Abrir no browser o endereço [http://127.0.0.1:8008/admin](http://127.0.0.1:8008/admin)
