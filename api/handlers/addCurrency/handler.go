package addCurrency

import (
	"challenge-bravo-1/api/controller"
	"encoding/json"

	httping "github.com/ednailson/httping-go"
	"github.com/go-playground/validator/v10"
)

type Handler struct {
	ctl controller.Controller
}

type currency struct {
	Initials string `json:"initials", validate:"required"`
}

func NewHandler(ctl controller.Controller) *Handler {
	return &Handler{ctl: ctl}
}

func (h *Handler) Handle(request httping.HttpRequest) httping.IResponse {
	var curr currency
	err := json.Unmarshal(request.Body, &curr)
	if err != nil {
		return httping.BadRequest(map[string]string{"body": "invalid body"})
	}
	err = Validate(curr)
	if err != nil {
		return httping.BadRequest(map[string]string{"body": err.Error()})
	}
	err = h.ctl.NewCurrency(curr.Initials)
	if err != nil {
		return httping.InternalServerError(map[string]string{"err": err.Error()})
	}
	return httping.OK(map[string]interface{}{"status": "Created", "data": curr})
}

func Validate(data interface{}) error {
	validate := validator.New()
	return validate.Struct(data)
}
