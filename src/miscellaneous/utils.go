package miscellaneous

import (
	"challenge-bravo/src/model"
	"encoding/json"
	"io/ioutil"
	"log"
)

//ReadConfig ... Função responsável por ler as configurações do sistema
func ReadConfig(config *model.Config) {

	//Lendo arquivo de configuração
	file, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(file, &config)

}
