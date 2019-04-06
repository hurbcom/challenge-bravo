package api

import (
	"net/http"

	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/log"
	"github.com/labstack/echo"
)

type Handler struct {
	DBController controller.DBController
}

//ConverterRequest is the structure that holds all fields
//necessary to be passed to the conversion API route
type ConverterRequest struct {
	From   string  `query:"from"`
	To     string  `query:"to"`
	Amount float64 `amount:"amount"`
}

//Healthcheck handles the healthcheck request
//This route is necessary to allow the validation of API status
func (h Handler) Healthcheck(c echo.Context) error {
	return c.String(http.StatusOK, "OK")
}

//Converter handles the currency conversion request
func (h Handler) Converter(c echo.Context) error {
	request := ConverterRequest{}
	if err := c.Bind(&request); err != nil {
		log.Error(err.Error(), "api")
		return c.JSON(http.StatusBadRequest, map[string]interface{}{"success": false, "message": "invalid parameters"})
	}
	response, err := calculate(h.DBController, request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{"success": false, "message": err.Error()})
	}
	structureResponse := map[string]interface{}{"success": true, "result": response}
	return c.JSON(http.StatusOK, structureResponse)
}
