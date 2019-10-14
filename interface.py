#importando a biblioteca gráfica tkinter do python e o script de conversão criado para esse projeto.
from tkinter import *
import converter as cv
  
class Application:
    def __init__(self, master=None):

        #quando o programa é iniciado, os dados das moedas já existentes é atualizado e colocados em um arquivo do tipo json.
        cv.atualiza_json()

        #o primeiro container da aplicação é o texto que aparece com o título da aplicação.
        self.fontePadrao = ("Arial", "10")
        self.primeiroContainer = Frame(master)
        self.primeiroContainer["pady"] = 10
        self.primeiroContainer.pack()
  
        #o segundo container é o texto "de", que indica onde o usuário deve digitar a moeda da qual ele pretende converter o valor.
        self.segundoContainer = Frame(master)
        self.segundoContainer["padx"] = 20
        self.segundoContainer.pack()
  
        #o terceiro container é o "para", que indica para qual moeda o usuário quer converter.
        self.terceiroContainer = Frame(master)
        self.terceiroContainer["padx"] = 20
        self.terceiroContainer.pack()

        #o quarto container é onde o usuário expressa a quantidade de moedas que devem ser convertidas.
        self.quartoContainer = Frame(master)
        self.quartoContainer["padx"] = 20
        self.quartoContainer.pack()

        #o quinto container é o botão que executa a conversão de moedas.
        self.quintoContainer = Frame(master)
        self.quintoContainer["pady"] = 20
        self.quintoContainer.pack()

        #add1 é o container que representa o espaço para o usuário colocar o nome de uma moeda que ele deseja adicionar ao conversor.
        self.add1Container = Frame(master)
        self.add1Container["padx"] = 20
        self.add1Container.pack()

        #add2 é o container que representa o espaço para o usuário colocar a sigla de uma moeda que se deseja adicionar ao conversor.
        self.add2Container = Frame(master)
        self.add2Container["padx"] = 20
        self.add2Container.pack()

        #o sexto container contém o texto de adicionar uma nova moeda.
        self.sextoContainer = Frame(master)
        self.sextoContainer["pady"] = 20
        self.sextoContainer.pack()

        self.respContainer = Frame(master)
        self.respContainer["pady"] = 20
        self.respContainer.pack()
  
        self.titulo = Label(self.primeiroContainer, text="Conversor Monetário")
        self.titulo["font"] = ("Arial", "10", "bold")
        self.titulo.pack()
  
        self.fromLabel = Label(self.segundoContainer,text="De", font=self.fontePadrao)
        self.fromLabel.pack(side=LEFT)
  
        self.from_currency = Entry(self.segundoContainer)
        self.from_currency["width"] = 10
        self.from_currency["font"] = self.fontePadrao
        self.from_currency.pack(side=LEFT)
  
        self.toLabel = Label(self.terceiroContainer, text="Para ", font=self.fontePadrao)
        self.toLabel.pack(side=LEFT)

        self.to_currency = Entry(self.terceiroContainer)
        self.to_currency["width"] = 10
        self.to_currency["font"] = self.fontePadrao
        self.to_currency.pack(side=RIGHT)

        self.quantidadeLabel = Label(self.quartoContainer, text="Quantidade ", font=self.fontePadrao)
        self.quantidadeLabel.pack(side=LEFT)
  
        self.quantidade = Entry(self.quartoContainer)
        self.quantidade["width"] = 10
        self.quantidade["font"] = self.fontePadrao
        self.quantidade.pack(side=RIGHT)
  
        self.converter = Button(self.quintoContainer)
        self.converter["text"] = "Converter"
        self.converter["font"] = ("Calibri", "8")
        self.converter["width"] = 12
        self.converter["command"] = self.Converter
        self.converter.pack()

        self.addNomeLabel = Label(self.add1Container, text="nome ", font=self.fontePadrao)
        self.addNomeLabel.pack(side=LEFT)
  
        self.addNome = Entry(self.add1Container)
        self.addNome["width"] = 10
        self.addNome["font"] = self.fontePadrao
        self.addNome.pack(side=RIGHT)

        self.addSymbolLabel = Label(self.add2Container, text="sigla ", font=self.fontePadrao)
        self.addSymbolLabel.pack(side=LEFT)
  
        self.addSymbol = Entry(self.add2Container)
        self.addSymbol["width"] = 10
        self.addSymbol["font"] = self.fontePadrao
        self.addSymbol.pack(side=RIGHT)

        self.adicionar = Button(self.sextoContainer)
        self.adicionar["text"] = "adicionar moeda"
        self.adicionar["font"] = ("Calibri", "8")
        self.adicionar["width"] = 12
        self.adicionar["command"] = self.Adicionar
        self.adicionar.pack()
  
        #o respContainer é onde o resultado da conversão mostrado para o usuário.
        self.msg = Label(self.respContainer, text="", font=self.fontePadrao)
        self.msg.pack()
  
    #Método atrelado ao botão de conversao.
    def Converter(self):

        #pegando as variáveis preenchidas pelo usuário.
        from_currency = self.from_currency.get()
        to_currency = self.to_currency.get()
        amount = self.quantidade.get()

        #fazendo uma verificação se o a quantidade é um valor válido, float não negativo.
        try:
            amount = int(self.quantidade.get())
            if(amount < 0):
                print("Valor invalido. Por favor digite escolha um numero nao negativo.")

        except ValueError:
            print("Valor invalido. Por favor digite apenas numeros.")
        
        else:
            #a função verify verifica se as moedas escolidas existem no conversor.
            verify = cv.verify_valid_currencies(to_currency, from_currency)
            if(verify):
                result = cv.realiza_conversao(from_currency, to_currency, amount)
                
                self.msg["text"] = "Convertido de", '{:10,.2f}'.format(amount), from_currency, "para", '{:10,.2f}'.format(result), to_currency
            else:
                self.msg["text"] = "moeda inválida ou não disponível"

    #função atrelada ao botão para adicionar uma nova moeda ao conversor.
    def Adicionar(self):
        nome = self.addNome.get()
        sigla = self.addSymbol.get()
        
        #chamada da função do script do conversor que adiciona uma nova moeda.
        if(cv.add_currency(sigla, nome)):
            self.msg["text"] = "moeda adicionada com sucesso."
        else :
            self.msg["text"] = "Não foi possível adicionar esta moeda."

  
  
root = Tk()
Application(root)
root.mainloop()