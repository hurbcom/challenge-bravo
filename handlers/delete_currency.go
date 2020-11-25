package handlers

import (
	"github.com/ednailson/challenge-bravo/controller"
	"github.com/ednailson/httping-go"
)

func DeleteCurrency(ctrl *controller.Controller) httping.HandlerFunc {
	return func(request httping.HttpRequest) httping.IResponse {
		ctrl.DeleteCurrency(request.Params["currency"])
		return httping.NoContent()
	}
}
