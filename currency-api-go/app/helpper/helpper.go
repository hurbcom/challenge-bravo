// Importa valores de uma api externa.
package helpper

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
	"fmt"
	"log"

)

type ResponseAPI struct {
	Rates interface{} `json:"rates"`
	Base  string      `json:"base"`
	Date  string      `json:"date"`
}


// Pega o valor para uma moeda.
func ExternalAPIGetOne(key string) *ResponseAPI {
	var url string

	if key == "latest" {
		url = "https://api.exchangeratesapi.io/latest"
	} else {
		url = fmt.Sprintf("https://api.exchangeratesapi.io/latest/?symbols=USD&base=%s", key)
	}

	response, _ := http.Get(url)
	if response.StatusCode != 200 {
		return nil
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	var responseObject ResponseAPI
	json.Unmarshal(responseData, &responseObject)
	return &responseObject
}

/*
	Pega todos os valores da api externa:
	https://api.exchangeratesapi.io/
	Não é ideal mas a api é a mais simples que não
	pede para cadastrar uma chave de acesso. Essa Função
	não apresenta uma boa aparência porque eu não queria outra api
	e o python me acostumou mal com manipulação de json.
*/
func ExternalAPIGetAll() *ResponseAPI {
	codes := [33]string {"CAD","HKD","ISK","PHP","DKK","HUF","CZK",
		"GBP","RON","SEK","IDR","INR","BRL","RUB","HRK","JPY",
		"THB","CHF","EUR","MYR","BGN","TRY","CNY","NOK","NZD",
		"ZAR","USD","MXN","SGD","AUD","ILS","KRW","PLN"}

	var newResponse []string
	newResponse = append(newResponse,`{"rates":{`)

	for i := 0; i < len(codes); i++ {
		url := fmt.Sprintf("https://api.exchangeratesapi.io/latest/?symbols=USD&base=%s",
			codes[i])

			response, _ := http.Get(url)

		responseData, err := ioutil.ReadAll(response.Body)
		defer response.Body.Close()
		if err != nil {
			log.Fatal(err)
		}
		var responseObject ResponseAPI
		json.Unmarshal(responseData, &responseObject)

		rates := responseObject.Rates.(map[string]interface{})
		for _, value := range rates {
				var json string
				if codes[i] != "PLN" {
					json = fmt.Sprintf(`"%s":%f,`, codes[i], value)
					} else {
						json = fmt.Sprintf(`"%s":%f`, codes[i], value)
					}
					newResponse = append(newResponse, json)

		}
	}

	json := fmt.Sprintf(`}, "date": "2019-08-30" }`)
	newResponse = append(newResponse, json)
	newResponseString :=  strings.Join(newResponse," ")

	return createResp(newResponseString)
}

func createResp(jsonMessage string) *ResponseAPI{

	var responseApi ResponseAPI
	err := json.Unmarshal([]byte(jsonMessage), &responseApi)
	if err != nil {
		log.Println(err)
		return nil
	}
	return &responseApi
}