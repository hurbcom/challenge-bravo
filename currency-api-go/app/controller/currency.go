package controller

import (
	"encoding/json"

    "net/url"
	//"log"
	"net/http"
	"strconv"
	"strings"
	//"reflect"
	"fmt"
	"github.com/challenge-bravo/currency-api-go/app/model"
	"github.com/challenge-bravo/currency-api-go/app/helpper"
	"github.com/challenge-bravo/currency-api-go/app/config/redis"
	"github.com/gorilla/mux"
)

type CurrencyConvertion struct {
	From 				string  `json:"from"`
	To					string  `json:"to"`
	Amount				float64 `json:"amount"`
	Amount_converted 	float64 `json:"amount_converted"`
}

var database =  model.InitializeDB()

func Import_all(w http.ResponseWriter, r*http.Request){
	flag := false
	var response  helpper.Response
	response = *helpper.External_api_values("latest")
	ratesList := response.Rates.(map[string]interface{})

	for key, value := range ratesList {
		currency := model.Currency{}
		currency.Name = key
		currency.Usd_value =  convertAmountStringtoFloat(fmt.Sprint(value))
		if err := database.Save(&currency).Error; err == nil {
			flag = true
		}
	}
	if flag{
		RespondJSON(w, http.StatusCreated, nil)
		return
	}
	RespondError(w, http.StatusNotModified, "")
}
func GetAllCurrencys(w http.ResponseWriter, r *http.Request) {
	currencys := []model.Currency{}
	reply, err := redis.Get("currencys")

	if err != nil {
		fmt.Println("Buscando no mysql")
		//movies, err := dao.GetAll()
		database.Find(&currencys)
		handleError(err)
		m, err := json.Marshal(currencys)
		handleError(err)
		redis.Set("currencys", []byte(m))
		RespondJSON(w, http.StatusOK, currencys)


	} else {
		fmt.Println("Buscando no redis")
		json.Unmarshal(reply, &currencys)
		RespondJSON(w, http.StatusOK, currencys)
	}

/*
	currencys := []model.Currency{}
	database.Find(&currencys)
	RespondJSON(w, http.StatusOK, currencys)*/
}


func handleError(err error) {
	if err != nil {
	   fmt.Println(err)
	}
  }

func CreateCurrency(w http.ResponseWriter, r *http.Request) {
	currency := model.Currency{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&currency); err != nil {
		RespondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := verifyCurrecyName(currency.Name); err != false{
		RespondError(w, http.StatusInternalServerError, "Currency must be 3 characters!")
		return
	}

	if currency.Usd_value == 0{
		var response  helpper.Response
		response = *helpper.External_api_values("BRL")
		ratesList := response.Rates.(map[string]interface{})
		for _, value := range ratesList {
			currency.Usd_value =  convertAmountStringtoFloat(fmt.Sprint(value))
		}
	}

	currency.Name = strings.ToUpper(currency.Name)

	if err := database.Save(&currency).Error; err != nil {
		RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondJSON(w, http.StatusCreated, currency)
}

func verifyCurrecyName(name string) bool {
	if len(name) == 3 {
		return false
	}
	return true
}

func GetOneCurrency(w http.ResponseWriter, r *http.Request) {
	currency := get_by_currency_code(w,r)
	if currency == nil {
		return
	}
	RespondJSON(w, http.StatusOK, currency)
}

func UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	currency := get_by_currency_code(w,r)
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
	currency := get_by_currency_code(w,r)

	if currency != nil {
		if err := database.Unscoped().Delete(&currency).Error; err != nil {
			RespondError(w, http.StatusInternalServerError, err.Error())
			return
		}
		return
	}
	RespondJSON(w, http.StatusNoContent, nil)
}

func get_by_currency_code(w http.ResponseWriter, r *http.Request) *model.Currency {
	vars := mux.Vars(r)
	currency_code := vars["currency_code"]
	return getCurrencyOr404(currency_code, w, r)
}

func GetConvertion(w http.ResponseWriter, r *http.Request) {
	var convertionJson CurrencyConvertion
	var keys = [2]string{"from","to"}
	var usd_values [2]float64
	
	urlParams := r.URL.Query()
	
	
	if verifyParameters(urlParams){
		convertionJson.From = urlParams["from"][0]
		convertionJson.To = urlParams["to"][0]
		redis_name :=  convertionJson.From + "_to_"+ convertionJson.To
		reply, err := redis.Get(redis_name)

		if err != nil  {
			fmt.Println("mysql")
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
			m, _ := json.Marshal(convertionJson)
			redis.Set(redis_name, []byte(m))

			RespondJSON(w, http.StatusOK, convertionJson)
			return
		} else {
			fmt.Println("redis")
			json.Unmarshal(reply, &convertionJson)
			RespondJSON(w, http.StatusOK, convertionJson)
			return
		}
	} else {
		RespondError(w, http.StatusBadRequest, "Formato da pesquisa invalido!")
		return
	}
	//RespondJSON(w, http.StatusOK, nil)


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
