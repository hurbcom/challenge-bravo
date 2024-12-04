package conversion

import (
	"fmt"
	"regexp"

	"github.com/Rhymond/go-money"
	"github.com/shopspring/decimal"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

// ConvertMoney converts money from one currency to another
func (s *Service) ConvertMoney(c *ConversionValues, bc string) (*ConversionResponse, error) {
	amount, err := decimal.NewFromString(c.Amount)
	if err != nil {
		return nil, err
	}
	if c.From.CurrencyRate == c.To.CurrencyRate {
		return getConversionResponse(amount, c)
	}

	if c.From.Code == bc {
		amountTo := getAmountFromRate(c.To.CurrencyRate, amount)
		return getConversionResponse(amountTo, c)
	}

	amountFromToUSD := getBackingCurrencyAmount(c.From.CurrencyRate, amount)
	amountTo := getAmountFromRate(c.To.CurrencyRate, amountFromToUSD)
	return getConversionResponse(amountTo, c)
}

func getBackingCurrencyAmount(currentRate string, amount decimal.Decimal) decimal.Decimal {
	currencyRate, _ := decimal.NewFromString(currentRate)
	return amount.Div(currencyRate)
}

func getAmountFromRate(currentRate string, amount decimal.Decimal) decimal.Decimal {
	currencyRate, _ := decimal.NewFromString(currentRate)
	return amount.Mul(currencyRate)
}

func convertAmountToMoney(amount decimal.Decimal, code string) *money.Money {
	digits := amount.NumDigits()
	factor := 10 * digits
	amountMul := amount.Mul(decimal.NewFromInt(int64(factor)))
	amountInt := amountMul.IntPart()
	return money.New(int64(amountInt), code)
}

func getConversionResponse(amount decimal.Decimal, c *ConversionValues) (*ConversionResponse, error) {
	currenciesMoney := money.New(0, c.To.Code)
	toFraction := int32(currenciesMoney.Currency().Fraction)
	amountRounded := amount.Round(toFraction)
	strAmount := amountRounded.String()
	re := regexp.MustCompile(`\.`)
	if !re.MatchString(strAmount) {
		strAmount = fmt.Sprintf("%s.%s", strAmount, "00")
	}
	return &ConversionResponse{
		Description: fmt.Sprintf("Conversion from %s to %s", c.From.Code, c.To.Code),
		Amount:      strAmount,
	}, nil
}
