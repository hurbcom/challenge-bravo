package convert

import (
	"challenge-bravo-1/api/controller"
	"strconv"

	httping "github.com/ednailson/httping-go"
)

type Handler struct {
	ctl controller.Controller
}

type converted struct {
	From   string
	To     string
	Amount float64
	Value  float64
}

func NewHandler(ctl controller.Controller) *Handler {
	return &Handler{ctl: ctl}
}

func (h *Handler) Handle(request httping.HttpRequest) httping.IResponse {
	var to = request.Query.Get("to")
	if to == "" {
		return httping.BadRequest(map[string]string{"to": "the field to is required"})
	}
	var from = request.Query.Get("from")
	if from == "" {
		return httping.BadRequest(map[string]string{"to": "the field from is required"})
	}
	var amount = request.Query.Get("amount")
	if amount == "" {
		return httping.BadRequest(map[string]string{"to": "the field amount is required"})
	}
	parsedAmount, err := strconv.ParseFloat(amount, 64)
	if err != nil {
		return httping.BadRequest(map[string]string{"amount": "invalid type for amount"})
	}
	value, err := h.ctl.Convert(to, from, parsedAmount)
	if err != nil {
		return httping.InternalServerError(map[string]string{"err": err.Error()})
	}
	var crv converted
	crv.From = from
	crv.To = to
	crv.Amount = parsedAmount
	crv.Value = *value
	return httping.OK(map[string]interface{}{"status": "success", "data": crv})
}
