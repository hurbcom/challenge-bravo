
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
    
    print("rate dollar/" + to_currency , from_rate)
    print("rate dollar/" + from_currency , to_rate)

    total = (amount/from_rate)*to_rate

    print("total amount", total)


if __name__ == "__main__" : 
  
    # function calling 
    #RealTimeCurrencyExchangeRate(from_currency, to_currency, api_key) 
    teste_json("eur", "brl", amount)

