package handlers

import (
	"github.com/ednailson/challenge-bravo/controller"
	"github.com/ednailson/challenge-bravo/currency"
	"github.com/ednailson/httping-go"
	"strconv"
)

func Convert(ctrl *controller.Controller) httping.HandlerFunc {
	return func(request httping.HttpRequest) httping.IResponse {
		from := request.Query.Get("from")
		if from == "" {
			return httping.BadRequest(map[string]string{"from": "from is required"})
		}
		to := request.Query.Get("to")
		if from == "" {
			return httping.BadRequest(map[string]string{"to": "to is required"})
		}
		amountStr := request.Query.Get("amount")
		if amountStr == "" {
			return httping.BadRequest(map[string]string{"amount": "amount is required"})
		}
		amount, err := strconv.ParseFloat(amountStr, 64)
		if err != nil {
			return httping.BadRequest(map[string]string{"amount": "amount is invalid"})
		}
		converted, err := ctrl.Convert(from, to, amount)
		if err != nil {
			switch err {
			case currency.ErrCurrencyNotExist:
				return httping.BadRequest(map[string]string{"currency": "from and/or to currency is invalid"})
			default:
				return httping.InternalServerError("server internal error")
			}
		}
		return httping.OK(map[string]float64{"result": converted})
	}
}
