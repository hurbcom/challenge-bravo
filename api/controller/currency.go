package controller

import (
	"github.com/labstack/echo"
	"net/http"
	"schonmann/challenge-bravo/monetary"
)

/**
  Currency conversion API.
*/

type ConversionRequest struct {
	Amount float64 `query:"amount"`
	From   string  `query:"from"`
	To     string  `query:"to"`
}

type ConversionResult struct {
	Amount          float64 `json:"amount"`
	From            string  `json:"from"`
	To              string  `json:"to"`
	ResultingAmount float64 `json:"resultingAmount"`
}

type ConversionError struct {
	Status int    `json:"status"`
	Error  string `json:"error"`
}

func HandleCurrencyConversion(context echo.Context) error {
	request := ConversionRequest{}

	err := context.Bind(&request)

	if err != nil {
		return context.JSON(http.StatusBadRequest, ConversionError{
			Status: http.StatusBadRequest,
			Error:  "Error parsing. Check your request.",
		})
	}

	if request.From == "" || request.To == "" || request.Amount == 0 {
		return context.JSON(http.StatusBadRequest, ConversionError{
			Status: http.StatusBadRequest,
			Error:  "Bad request parameters. Missing/mistyped query?",
		})
	}

	resultAmount, err := monetary.ConvertCurrency(request.Amount, request.From, request.To)
	if err != nil {
		return context.JSON(http.StatusInternalServerError, ConversionError{
			Status: http.StatusInternalServerError,
			Error:  err.Error(),
		})
	}

	/* Currency conversion terminated. Just return the json. */

	return context.JSON(http.StatusOK, ConversionResult{
		Amount:          request.Amount,
		From:            request.From,
		To:              request.To,
		ResultingAmount: resultAmount,
	})
}
