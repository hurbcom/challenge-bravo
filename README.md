# Conversor de Moedas

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

Esse projeto é um sistema de conversão de moedas reais e ficticias.

## Pré-requisitos

Antes de começar, certifique-se de que você tenha o seguinte software instalado em seu ambiente:

- Python 3.x
- FastApi
- Redis

## Instalação

1. **Clonando o repositório**

   Clone este repositório para o seu ambiente local:

   ```
   git clone https://github.com/gabrielgimenez98/challenge-bravo.git
   cd challenge-bravo

2. **Criando Ambiente Virtual**

   Clone este repositório para o seu ambiente local:

   ```
    python3 -m venv venv
    source venv/bin/activate  # No Windows, use "venv\Scripts\activate"

3. **Instalando dependências**

   Instale as dependências usando

   ```
    pip install -r requirements.txt
    
4. **Rodando o projeto localmente**

   ```
    uvicorn views:app --reload
    ```

    Após isso é possível encontrar o swagger na rota ```\docs```

5. **Rodando os testes unitários**

   ```
    pytest -s tests/
    ```

6. **Rodando os testes de carga**

   ```
    locust -f tests/stress_test.py --headless -u 1000 -r 100
    ```
    Os testes de carga são úteis para avaliar o desempenho da API sob carga simulada. Os parâmetros `-u` e `-r` definem o número de usuários e a taxa de aumento de usuários, respectivamente.
