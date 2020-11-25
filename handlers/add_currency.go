package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/ednailson/challenge-bravo/controller"
	"github.com/ednailson/httping-go"
)

type add struct {
	Currency string `json:"currency"`
}

func AddCurrency(ctrl *controller.Controller) httping.HandlerFunc {
	return func(request httping.HttpRequest) httping.IResponse {
		var currency add
		err := json.Unmarshal(request.Body, &currency)
		if err != nil || currency.Currency == "" {
			return httping.BadRequest(map[string]string{"body": "body is invalid"})
		}
		err = ctrl.AddCurrency(currency.Currency)
		if err != nil {
			return httping.BadRequest(map[string]string{"currency": "currency is invalid"})
		}
		return httping.OK(map[string]string{currency.Currency: fmt.Sprintf("%s has been added", currency.Currency)})
	}
}
