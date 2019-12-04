package cronroutines

import (
	"challenge-bravo/src/miscellaneous"
	"challenge-bravo/src/model"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var config model.Config

func init() {
	//Lendo variavel de configuração para obter valor da chave de acesso e do endpoint da API
	miscellaneous.ReadConfig(&config)
}

//UpdateCurrencies ... Rorina responsável por fazer a atualização das taxas de câmbio
func UpdateCurrencies() {

	log.Println("Iniciando serviço de atualização de taxas ...")

	//Fazendo chamada na Api externa
	resp, err := http.Get(config.APIUrl + "?app_id=" + config.APIKey + "&show_alternative=true")
	if err != nil {
		log.Println("Erro ao realizar requisição externa: ", err)
		return
	}

	//Lendo o corpo da resposta
	respBinary, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		log.Println("Erro ao ler o body de resposta: ", err)
		return
	}

	//Parseando o corpo da resposta com a estrutura desejada
	var data model.CurrencyResponse
	json.Unmarshal(respBinary, &data)

	//Verificando se a resposta retornou válida
	if data.Rates == nil {
		log.Println("Erro: ", string(respBinary))
		return
	}

	//Atualizando o arquivo 'currencies.json'
	responseString, _ := json.MarshalIndent(data, "", "  ")
	err = ioutil.WriteFile("currencies2.json", responseString, os.ModePerm)
	if err != nil {
		log.Println("Erro ao salvar o arquivo 'currencies.json': ", err)
		return
	}

	log.Println("Taxas atualizadas com sucesso!")
	return
}
