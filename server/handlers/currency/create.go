package currency

import (
	"challenge-bravo/models"
	"challenge-bravo/server/db"
	"challenge-bravo/server/services"
	"challenge-bravo/utils"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

//Create inserts a new currency in database
func Create(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "It wasn't possible convert Request Body to JSON", false)
		return
	}
	defer r.Body.Close()

	var currency models.Currency
	err = json.Unmarshal(body, &currency)

	var value float64

	if currency.Value == 0 {
		value, err = services.ExchangeAPI(currency.Code)
		if err != nil {
			log.Println(err.Error())
			utils.HTTPResponse(w, http.StatusInternalServerError, "Cannot connect to Exchange API, please try again.", false)
			return
		}
	} else {
		value = currency.Value
	}

	result, err := db.Connection.Exec(utils.BuildString("INSERT INTO moedas (nome, codigo, valor) VALUES ('", currency.Name, "', '", currency.Code, "', '", value, "')"))
	if err != nil {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while inserting data, please try again.", false)
		return
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while inserting data, please try again.", false)
		return
	}

	utils.HTTPResponse(w, http.StatusOK, "Currency inserted successfully!", false)
}
