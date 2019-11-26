#Importação de módulos do projeto
from appHurb.views import appHurb
from appHurb.requests import updateDB


if (__name__) == "__main__":
    updateDB() #Eu chamo essa função aqui para que o banco de dados seja atualizado sempre que o servidor é iniciado
    appHurb.run(debug=True)



