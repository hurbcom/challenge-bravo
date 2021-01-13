package getCurrencies

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
	currencies := h.ctl.GetAllCurrencies()
	return httping.OK(currencies)
}
