# desafio-bravo
#API de conversão de moedas
git clone: https://github.com/RonaldPSantos/desafio-bravo.git

realiza a conversão de moedas a fim de ter o valor total possível de compra.

1 - Sistema em Python 3.9.5/Flask Framework, roda em ambiente virtual Conda

2 - Database SQLite
    
2 - Instalando as dependências:

    Usar o pip, caso não tenha o pip instalado:
        sudo apt update
        sudo apt install python3-pip
        pip3 --version
        pip install requirements.txt

4 - Executando a aplicação

    cd challenge-bravo
    python app.py

5 - Endpoints

    Conversão de moedas:

        http://127.0.0.1:5000/change?frm=BRL&to=USD&amount=400

    Lista das moedas cadastradas

        http://127.0.0.1:5000/exchanges

    Cadastro de novas moedas (post)

        http://127.0.0.1:5000/exchange
        fields form-data:

        frm:(from)
        to:
        value: (somente para moedas fictícias)
        
        Moedas fictícias: Quando ocorrer o cadastro de moedas fictícias o valor corrente deverá ser  informado no campo (value)


    Delete de conversão
        http://127.0.0.1:5000/exchange
        field form-data:
        
        id: (id da conversão a ser deletada)



    
