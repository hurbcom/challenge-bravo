
valid_currencies = ["dol", "eur", "brl", "btc", "eth"]

curr_amount = 5

print("Available currencies: ", end='')
for item in sorted(valid_currencies)[:-1]:
    print(item, end=', ')
print(sorted(valid_currencies)[-1])

while True:

    try:
        amount = float(input("Enter amount: "))
        if(amount < 0):
            print("Valor invalido. Por favor digite escolha um numero nao negativo.")
            continue
        # checking for input errors
    except ValueError:
        print("Valor invalido. Por favor digite apenas numeros.")
    else:
        break

input_cur = input("Enter base currency code: ").lower()
print("input currency", input_cur)
output_cur = input("Enter desired currency code: ").lower()
print("output currency", output_cur)

def teste_json(from_currency, to_currency, amount):
    
    import requests, json

    r = requests.get('http://www.floatrates.com/daily/usd.json')

    result = r.json()

    if(from_currency == "dol"):
        from_rate = 1
    else :
        from_rate = result[from_currency]["rate"]
    
    if(to_currency == "dol"):
        to_rate = 1
    else :
        to_rate = result[to_currency]["rate"]
    
    print("rate dollar/" + from_currency, from_rate)
    print("rate dollar/" + to_currency , to_rate)

    total = (amount/from_rate)*to_rate

    print("total amount", total)

def teste_crypto(crypto_name):
    import requests

    r = requests.get('https://api.coinmarketcap.com/v1/ticker/'+crypto_name)

    result = r.json()

    print(result[0]['price_usd'])


if __name__ == "__main__" : 
  
    # function calling 
    #RealTimeCurrencyExchangeRate(from_currency, to_currency, api_key) 
    teste_json(input_cur, output_cur, amount)
    teste_crypto("bitcoin")

