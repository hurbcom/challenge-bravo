package controller

import (
	"encoding/json"

    "net/url" 
	//"log"
	"net/http"
	"strconv"
	//"reflect"
	//"fmt"
	//log "gopkg.in/inconshreveable/log15.v2"
	"github.com/challenge-bravo/currency-api-go/app/model"
	//"github.com/challenge-bravo/currency-api-go/app/db"

	"github.com/gorilla/mux"
	//"github.com/jinzhu/gorm"
)

type CurrencyConvertion struct {
	From 				string  `json:"from"`
	To					string  `json:"to"`
	Amount				float64 `json:"amount"`
	Amount_converted 	float64 `json:"amount_converted"`
}

var database =  model.InitializeDB()

func GetAllCurrencys(w http.ResponseWriter, r *http.Request) {
	currencys := []model.Currency{}
	database.Find(&currencys)
	RespondJSON(w, http.StatusOK, currencys)
}

func CreateCurrency(w http.ResponseWriter, r *http.Request) {
	currency := model.Currency{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&currency); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := database.Save(&currency).Error; err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondJSON(w, http.StatusCreated, currency)
}

func GetCurrency(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	currency := getCurrencyOr404(name, w, r)
	if currency == nil {
		return
	}
	RespondJSON(w, http.StatusOK, currency)
}

func UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	currency := getCurrencyOr404(name, w, r)
	if currency == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&currency); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := database.Save(&currency).Error; err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondJSON(w, http.StatusOK, currency)
}

func DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	currency := getCurrencyOr404(name, w, r)
	if currency == nil {
		if err := database.Delete(&currency).Error; err != nil {
			RespondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		return
	}
	RespondJSON(w, http.StatusNoContent, nil)
}

func GetConvertion(w http.ResponseWriter, r *http.Request) {
	var convertionJson CurrencyConvertion
	var keys = [2]string{"from","to"}
	var usd_values [2]float64

	urlParams := r.URL.Query()

	if verifyParameters(urlParams){
		convertionJson.From = urlParams["from"][0]
		convertionJson.To = urlParams["to"][0]
		for i, e :=  range keys {
			currencys := model.Currency{}
			search := urlParams[e][0]
			database.Where("Name = ?", search).First(&currencys)
			usd_values[i] = currencys.Usd_value
		}

		amount := convertAmountStringtoFloat(urlParams["amount"][0])
		if amount == 0 {
			RespondError(w, http.StatusBadRequest, "Adicione um valor valido")
			return
		}
		convertionJson.Amount = amount
		convertionJson.Amount_converted = convertAmount(usd_values[0], usd_values[1], amount)

		RespondJSON(w, http.StatusOK, convertionJson)
		return
	} else {
		RespondError(w, http.StatusBadRequest, "Formato da pesquisa invalido!")
		return
	}
	RespondJSON(w, http.StatusOK, nil)


}

func verifyParameters(params url.Values) bool {
	if len(params) == 0 {
		return false
	}

	for key := range params {
		if !(key == "from" || key == "to" || key == "amount") {
			return false
		}
    }
	return true
}

func convertAmountStringtoFloat(amount string) float64 {
	floatAmount, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		return 0
	}
	return floatAmount

}

func convertAmount(from_value float64, to_value float64, amount float64) float64 {
	return (from_value / to_value) * amount
}

// getCurrencyOr404 gets a currency instance if exists, or respond the 404 error otherwise
func getCurrencyOr404(name string, w http.ResponseWriter, r *http.Request) *model.Currency {
	currency := model.Currency{}
	if err := database.First(&currency, model.Currency{Name: name}).Error; err != nil {
		RespondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &currency
}