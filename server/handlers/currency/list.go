package currency

import (
	"challenge-bravo/models"
	"challenge-bravo/server/db"
	"challenge-bravo/utils"
	"log"
	"net/http"
)

func List(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Connection.Query("SELECT * FROM moedas")
	if err != nil {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "It wasn't possible to retrieve data from database, please try again.", false)
		return
	}

	var currencies models.Currencies
	for rows.Next() {
		var currency models.Currency
		rows.Scan(
			&currency.ID,
			&currency.Name,
			&currency.Code,
			&currency.Value,
		)

		currencies.Currencies = append(currencies.Currencies, currency)
	}

	utils.HTTPResponse(w, http.StatusOK, currencies.ToJSON(), true)
}
