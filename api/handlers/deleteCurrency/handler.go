package deleteCurrency

import (
	"challenge-bravo-1/api/controller"

	httping "github.com/ednailson/httping-go"
)

type Handler struct {
	ctl controller.Controller
}

func NewHandler(ctl controller.Controller) *Handler {
	return &Handler{ctl: ctl}
}

func (h *Handler) Handle(request httping.HttpRequest) httping.IResponse {
	if request.Params["currency"] == "" {
		return httping.BadRequest(map[string]string{"currency": "the field currency is required"})
	}
	err := h.ctl.DeleteCurrency(request.Params["currency"])
	if err != nil {
		return httping.InternalServerError(map[string]string{"err": err.Error()})
	}
	return httping.OK(map[string]string{"status": "success"})
}
