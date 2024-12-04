package gin

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/danielmalka/challenge-bravo/application/conversion"
	"github.com/danielmalka/challenge-bravo/application/currency"
	"github.com/gin-gonic/gin"
)

// doConversion godoc
// @Summary Convert a amount
// @Schemes
// @Description Convert a specified amount from one currency to another using the latest exchange rates
// @Tags conversion
// @Accept json
// @Param from query string true "Currency code to convert from"
// @Param to query string true "Currency code to convert to"
// @Param amount query number true "Amount to be converted"
// @Produce json
// @Success 200 {object} conversion.ConversionResponse
// @Failure 400 {object} gin.Message
// @Failure 500 {object} gin.Message
// @Router /v1/conversion [get]
func doConversion(currencyService *currency.Service, response Message) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request conversion.ConversionData
		fromQuery := c.Query("from")
		toQuery := c.Query("to")
		amountQuery := c.Query("amount")
		if err := validateQueryString(fromQuery, toQuery, amountQuery); err != nil {
			log.Println("error binding JSON: ", err)
			response.StatusCode = http.StatusBadRequest
			// make a better response message
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
			return
		}
		request.From = fromQuery
		request.To = toQuery
		request.Amount = amountQuery

		if request.From == request.To {
			response.StatusCode = http.StatusBadRequest
			response.Message = gin.H{ERROR_STR: "from and to currencies must be different"}
			c.JSON(response.StatusCode, response.Message)
			return
		}

		currencies, err := currencyService.GetByCodes(request.From, request.To)
		if err != nil {
			log.Println("error getting currencies: ", err)
			response.StatusCode = http.StatusInternalServerError
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
		}

		conversionValues := conversion.ConversionValues{
			Amount: request.Amount,
		}
		var bc string
		for _, currency := range currencies {
			if currency.Code == request.From {
				conversionValues.From.Code = currency.Code
				conversionValues.From.CurrencyRate = currency.CurrencyRate
			}
			if currency.Code == request.To {
				conversionValues.To.Code = currency.Code
				conversionValues.To.CurrencyRate = currency.CurrencyRate
			}
			if currency.BackingCurrency == true {
				bc = currency.Code
			}
		}
		conversionService := conversion.NewService()
		conversionResponse, err := conversionService.ConvertMoney(&conversionValues, bc)
		if err != nil {
			log.Println("error getting currencies: ", err)
			response.StatusCode = http.StatusInternalServerError
			response.Message = gin.H{ERROR_STR: err.Error()}
			c.JSON(response.StatusCode, response.Message)
		}

		response.StatusCode = http.StatusOK
		c.JSON(response.StatusCode, conversionResponse)
	}
}

func validateQueryString(from, to, amount string) error {
	if strings.TrimSpace(from) == "" {
		return errors.New("from are required")
	}
	if strings.TrimSpace(to) == "" {
		return errors.New("to are required")
	}
	if strings.TrimSpace(amount) == "" {
		return errors.New("amount are required")
	}
	return nil
}
