package handlers

import (
	"fmt"
	"github.com/ednailson/challenge-bravo/controller"
	"github.com/ednailson/httping-go"
)

func AddCurrency(ctrl *controller.Controller) httping.HandlerFunc {
	return func(request httping.HttpRequest) httping.IResponse {
		currency := request.Params["currency"]
		err := ctrl.AddCurrency(currency)
		if err != nil {
			return httping.BadRequest(map[string]string{"currency": "currency is invalid"})
		}
		return httping.OK(map[string]string{currency: fmt.Sprintf("%s has been added", currency)})
	}
}
