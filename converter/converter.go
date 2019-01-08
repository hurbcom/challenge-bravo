package converter

import (
	"curapi/cache"
	"curapi/logger"
	"curapi/util"
	"strconv"
	"strings"

	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log

// CurrencyConverter :: Function responsible to conversion of currencies
func CurrencyConverter(amount float64, from, to string) (*float64, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	var val float64
	fromRawValue, err := cache.Get(strings.ToUpper(from))
	if err != nil {
		log.Error(err)
		return nil, err
	}
	toRawValue, err := cache.Get(strings.ToUpper(to))
	if err != nil {
		log.Error(err)
		return nil, err
	}
	fromFloatValue, _ := strconv.ParseFloat(fromRawValue, 64)
	toFloatValue, _ := strconv.ParseFloat(toRawValue, 64)
	ratio := toFloatValue / fromFloatValue
	if to == "BTC" || to == "ETH" {
		val = util.ToFixed((ratio * amount), 8) // Fixing 8 decimal places for crypto currencies
	} else {
		val = util.ToFixed((ratio * amount), 4) // Fixing 4 decimal places for others
	}
	return &val, nil
}

// GetCurrencyLabel :: Function responsible to return label of given currency
func GetCurrencyLabel(currency string) string {
	var label string
	switch currency {
	case "USD":
		label = "United States Dollar"
	case "BRL":
		label = "Brazilian Real"
	case "BTC":
		label = "Bitcoin"
	case "ETH":
		label = "Ethereum"
	case "EUR":
		label = "Euro"
		// ...
	}
	return label
}
