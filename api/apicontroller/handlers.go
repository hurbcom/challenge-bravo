package apicontroller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo"
)

// Response is the api success response
type Response struct {
	From   string  `json:"from"`
	To     string  `json:"to"`
	Amount float64 `json:"amount"`
	Result float64 `json:"result"`
}

// ErrorResponse is the api error response
type ErrorResponse struct {
	Message string `json:"message"`
}

func handleConvert(c echo.Context) error {
	from := c.QueryParam("from")
	to := c.QueryParam("to")
	amount, err := strconv.ParseFloat(c.QueryParam("amount"), 64)
	if from == "" || to == "" || err != nil {
		return c.JSON(http.StatusBadRequest, ErrorResponse{"Invalid query params"})
	}
	return c.JSON(http.StatusOK, Response{
		From:   from,
		To:     to,
		Amount: amount,
		Result: price.Convert(from, to, amount),
	})
}
