# Currency API

Esta é uma API simples para conversão de moedas e gerenciamento de moedas fictícias.

## Configuração

1. Certifique-se de ter o Python instalado em sua máquina. Você pode baixá-lo em [python.org](https://www.python.org/downloads/).

2. Clone este repositório:

    ```bash
    git clone https://caminho/para/o/repositório
    ```

3. Navegue até o diretório do projeto:

    ```bash
    cd currency_api
    ```

4. Crie um ambiente virtual (opcional, mas recomendado):

    ```bash
    python -m venv venv
    ```

5. Ative o ambiente virtual:

    - No Windows:

    ```bash
    venv\Scripts\activate
    ```

    - No macOS e Linux:

    ```bash
    source venv/bin/activate
    ```

6. Instale as dependências do projeto:

    ```bash
    pip install -r requirements.txt
    ```

7. Configure as variáveis de ambiente (opcional):

    - Renomeie o arquivo `.env.example` para `.env`
    - Edite o arquivo `.env` conforme necessário

## Executando a API

Para executar a API localmente, siga estas etapas:

1. Certifique-se de estar no diretório raiz do projeto e com o ambiente virtual ativado.

2. Execute o arquivo `run.py`:

    ```bash
    python run.py
    ```

A API estará disponível em `http://localhost:5000/`.

## Uso da API

A API possui os seguintes endpoints:

- `/convert`: Endpoint para converter uma quantidade de uma moeda para outra.
  - Parâmetros da query string:
    - `from`: Código da moeda de origem.
    - `to`: Código da moeda de destino.
    - `amount`: Quantidade a ser convertida.

- `/currencies`: Endpoint para listar todas as moedas cadastradas.
  - Métodos suportados: GET

- `/currencies`: Endpoint para adicionar uma nova moeda ao sistema.
  - Métodos suportados: POST
  - Corpo da requisição deve ser um JSON com os campos `code`, `name` e `rate_to_usd`.

- `/currencies/<currency_id>`: Endpoint para excluir uma moeda existente pelo ID.
  - Métodos suportados: DELETE
