package routes

import "net/http"

type ConversionController interface {
	ConvertCurrency(http.ResponseWriter, *http.Request)
}

type ConversionRoutes struct {
	controller ConversionController
}

func NewConversionRoutes(controller ConversionController) *ConversionRoutes {
	return &ConversionRoutes{controller}
}

var conversionRoutes = []Route{
	{
		URI:    "/convert",
		Method: http.MethodGet,
	},
}

func GenerateConversionRoutes(controller ConversionController) {
	newConversionRoutes := NewConversionRoutes(controller)

	conversionRoutes[0].Function = newConversionRoutes.controller.ConvertCurrency
}
