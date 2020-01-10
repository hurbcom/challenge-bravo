package handlers

import (
	"challenge-bravo/models"
	"challenge-bravo/server/db"
	"challenge-bravo/utils"
	"database/sql"
	"log"
	"net/http"
	"strconv"
)

//Exchange makes conversion between currencies using USD as base
func Exchange(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	if params.Get("from") == "" || params.Get("to") == "" {
		utils.HTTPResponse(w, http.StatusBadRequest, "Bad request, parameters missing.", false)
		return
	}

	var (
		from float64
		to   float64
	)

	err := db.Connection.QueryRow(utils.BuildString("SELECT valor FROM moedas WHERE codigo = '", params.Get("from"), "'")).Scan(&from)
	if err == sql.ErrNoRows {
		utils.HTTPResponse(w, http.StatusOK, utils.BuildString(params.Get("from"), " is not supported yet. You can create a new currency."), false)
		return
	} else if err != nil {
		log.Println(err)
		utils.HTTPResponse(w, http.StatusInternalServerError, "It wasn't possible to retrieve data from database, please try again.", false)
		return
	}

	err = db.Connection.QueryRow(utils.BuildString("SELECT valor FROM moedas WHERE codigo = '", params.Get("to"), "'")).Scan(&to)
	if err == sql.ErrNoRows {
		utils.HTTPResponse(w, http.StatusOK, utils.BuildString(params.Get("to"), " is not supported yet. You can create a new currency."), false)
		return
	} else if err != nil {
		log.Println(err)
		utils.HTTPResponse(w, http.StatusInternalServerError, "It wasn't possible to retrieve data from database, please try again.", false)
		return
	}

	amount, _ := strconv.ParseFloat(params.Get("amount"), 64)
	exchange := (amount / from) * to

	exchangeResponse := &models.ExchangeResponse{
		From:   params.Get("from"),
		To:     params.Get("to"),
		Amount: amount,
		Total:  exchange,
	}

	utils.HTTPResponse(w, http.StatusOK, exchangeResponse.ToJSON(), true)
}
