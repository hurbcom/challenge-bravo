from tkinter import *
import converter as cv
  
class Application:
    def __init__(self, master=None):
        self.fontePadrao = ("Arial", "10")
        self.primeiroContainer = Frame(master)
        self.primeiroContainer["pady"] = 10
        self.primeiroContainer.pack()
  
        self.segundoContainer = Frame(master)
        self.segundoContainer["padx"] = 20
        self.segundoContainer.pack()
  
        self.terceiroContainer = Frame(master)
        self.terceiroContainer["padx"] = 20
        self.terceiroContainer.pack()

        self.quartoContainer = Frame(master)
        self.quartoContainer["padx"] = 20
        self.quartoContainer.pack()

        self.quintoContainer = Frame(master)
        self.quintoContainer["pady"] = 20
        self.quintoContainer.pack()
  
        self.titulo = Label(self.primeiroContainer, text="Conversor Monetário")
        self.titulo["font"] = ("Arial", "10", "bold")
        self.titulo.pack()
  
        self.nomeLabel = Label(self.segundoContainer,text="De", font=self.fontePadrao)
        self.nomeLabel.pack(side=LEFT)
  
        self.from_currency = Entry(self.segundoContainer)
        self.from_currency["width"] = 10
        self.from_currency["font"] = self.fontePadrao
        self.from_currency.pack(side=LEFT)
  
        self.senhaLabel = Label(self.terceiroContainer, text="Para ", font=self.fontePadrao)
        self.senhaLabel.pack(side=LEFT)

        self.to_currency = Entry(self.terceiroContainer)
        self.to_currency["width"] = 10
        self.to_currency["font"] = self.fontePadrao
        self.to_currency["show"] = "*"
        self.to_currency.pack(side=RIGHT)

        self.quantidadeLabel = Label(self.quartoContainer, text="Quantidade ", font=self.fontePadrao)
        self.quantidadeLabel.pack(side=LEFT)
  
        self.quantidade = Entry(self.quartoContainer)
        self.quantidade["width"] = 10
        self.quantidade["font"] = self.fontePadrao
        self.quantidade["show"] = "*"
        self.quantidade.pack(side=RIGHT)
  
        self.autenticar = Button(self.quintoContainer)
        self.autenticar["text"] = "Converter"
        self.autenticar["font"] = ("Calibri", "8")
        self.autenticar["width"] = 12
        self.autenticar["command"] = self.Converter
        self.autenticar.pack()
  
        self.msg = Label(self.quintoContainer, text="", font=self.fontePadrao)
        self.msg.pack()
  
    #Método verificar senha
    def Converter(self):
        from_currency = self.from_currency.get()
        to_currency = self.to_currency.get()
        amount = self.quantidade.get()

        try:
            amount = float(self.quantidade.get())
            if(amount < 0):
                print("Valor invalido. Por favor digite escolha um numero nao negativo.")
            
        #checking for input errors
        except ValueError:
            print("Valor invalido. Por favor digite apenas numeros.")
        
        else:
            verify = cv.verify_valid_currencies(to_currency, from_currency)
            print(verify)
            if(verify):
                self.msg["text"] = "Autenticado", from_currency, to_currency, amount
            else:
                self.msg["text"] = "moeda inválida ou não disponível"
        
  
  
root = Tk()
Application(root)
root.mainloop()