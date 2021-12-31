package server

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
)

// ConvertResponse Response with currency conversion
type ConvertResponse struct {
	From   *model.Currency `json:"from,omitempty"` // From currency, visible only at verbose mode
	To     *model.Currency `json:"to,omitempty"`   // To currency, visible only at verbose mode
	Amount float64         `json:"amount"`         //  Amount converted
	Quote  float64         `json:"quote"`          // Quote value converted
}

// Convert Execute currency conversion
func Convert(c *fiber.Ctx) error {

	// Parse query parameters
	errors := dao.Error{Message: "bad request"}
	from := loadCurrency(c, "from", &errors)
	to := loadCurrency(c, "to", &errors)

	verbose, err := strconv.ParseBool(strings.TrimSpace(strings.ToLower(c.Query("verbose"))))
	if err != nil {
		verbose = false
	}

	var amount float64
	pAmount := strings.TrimSpace(c.Query("amount"))
	if len(pAmount) == 0 {
		errors.Append("parameter amount is required")
	} else {
		if amount, err = strconv.ParseFloat(pAmount, 64); err != nil {
			errors.Append(fmt.Sprintf("parameter amount must be numeric: %s", pAmount))
		}
	}

	// Return if there is any error
	if len(errors.Errors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	// Obtain currencies quotes
	fromRate := *from.Rate
	toRate := *to.Rate
	var finalQuote float64

	switch {
	case (from.Type == model.CryptoCurrency && to.Type == model.RealCurrency) ||
		(from.Type == model.CustomCurrency && to.Type == model.RealCurrency):
		finalQuote = fromRate * toRate * amount
	case (from.Type == model.RealCurrency && to.Type == model.CryptoCurrency) ||
		(from.Type == model.RealCurrency && to.Type == model.CustomCurrency):
		finalQuote = amount / (fromRate * toRate)
	case from.Type == model.RealCurrency && to.Type == model.RealCurrency:
		finalQuote = (toRate / fromRate) * amount
	case (from.Type == model.CryptoCurrency && to.Type == model.CryptoCurrency) ||
		(from.Type == model.CustomCurrency && to.Type == model.CustomCurrency) ||
		(from.Type == model.CustomCurrency && to.Type == model.CryptoCurrency) ||
		(from.Type == model.CryptoCurrency && to.Type == model.CustomCurrency):
		finalQuote = (fromRate / toRate) * amount
	}

	// Response preparation
	response := ConvertResponse{
		Amount: amount,
		Quote:  finalQuote,
		From:   nil,
		To:     nil,
	}
	if verbose {
		response.From = &from
		response.To = &to
	}
	return c.Status(fiber.StatusOK).JSON(response)
}

// loadCurrency Loads a model.Currency from query param or fill error structures on errors parameter.
func loadCurrency(c *fiber.Ctx, param string, errors *dao.Error) model.Currency {
	curr := model.Currency{
		Code: strings.TrimSpace(strings.ToUpper(c.Query(param))),
	}
	if len(curr.Code) == 0 {
		errors.Append("parameter " + param + " is required")
	} else {
		if err := curr.Load(); err != nil {
			errors.Append(fmt.Sprintf("%s %s: %s", param, err.Message, curr.Code))
		}
	}
	return curr
}
