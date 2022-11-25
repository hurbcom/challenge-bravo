package controllers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/Ricardo-Sales/challenge-bravo/models"
)

const (
	URL_GET_QUOTATION = "https://economia.awesomeapi.com.br/json/last/" // ex: last/BRL-USD
)

func GetQuotation(crin models.Currency, crout models.Currency) error {
	var quotation models.Quotation
	url := URL_GET_QUOTATION + crin.Code + "-" + crout.Code

	resp, err := http.Get(url)
	if err != nil {
		return err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(body, &quotation)
	if err != nil {
		return err
	}

	return nil

}
