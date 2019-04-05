package api

import (
	"errors"
	"math"

	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/log"
)

var (
	errDb        = errors.New("error on getting currency quotes")
	errParameter = errors.New("currency symbol not found")
)

func calculate(controller controller.DBController, request ConverterRequest) (float64, error) {
	symbols := []string{request.From, request.To}
	values, err := controller.GetCurrentRates(symbols)
	if err != nil {
		log.Error(err.Error(), "database")
		return -1, errDb
	}
	if values[request.To] == 0 || values[request.From] == 0 {
		log.Error(errParameter.Error(), "api")
		return -1, errParameter
	}
	response := (values[request.To] / values[request.From]) * request.Amount
	return math.Round(response*100) / 100, nil
}
