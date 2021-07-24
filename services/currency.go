package services

import (
	"errors"
	"fmt"
	"log"
	"strconv"

	"github.com/gustavowiller/challengebravo/database"
	"github.com/gustavowiller/challengebravo/models"
)

func CreateCurrency(currency *models.Currency) error {
	if currency.IsReal == true {
		if error := updateRate(currency); error != nil {
			return error
		}
	}

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Create(&currency).Error; error != nil {
		log.Printf(error.Error())
		return errors.New("Error create record at database.")
	}

	return nil
}

func updateRate(currency *models.Currency) error {
	exchangeRates, error := AllExchangeRates()
	if error != nil {
		return errors.New("Error comunicate with server obtain current exchange rates")
	}

	exchangeRate, found := exchangeRates[currency.Code]
	if !found {
		return errors.New("No real value exchange rate found for this currency")
	}

	rate, error := strconv.ParseFloat(exchangeRate, 64)
	if error != nil {
		return errors.New(error.Error())
	}

	currency.ExchangeRate = rate
	return nil
}

func ConvertCurrency(conversion *models.Conversion) (float64, error) {
	var currencyFrom models.Currency
	var currencyTo models.Currency

	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Where("code = ?", conversion.From).First(&currencyFrom).Error; error != nil {
		return 0,  errors.New(fmt.Sprintf("The code currency '%s' not found", conversion.From))
	}

	if error := database.Where("code = ?", conversion.To).First(&currencyTo).Error; error != nil {
		return 0, errors.New(fmt.Sprintf("The code currency '%s' not found", conversion.To))
	}

	return (conversion.Amount * currencyTo.ExchangeRate / currencyFrom.ExchangeRate), nil
}

func DeleteCurrency(currency *models.Currency) error {
	database := database.Connect()
	sqlDB, _ := database.DB()
	defer sqlDB.Close()

	if error := database.Where("code = ?", currency.Code).First(&currency).Error; error != nil {
		return errors.New(fmt.Sprintf("The code currency '%s' not found", currency.Code))
	}

	database.Where("code = ?", currency.Code).Delete(&models.Currency{})

	return nil
}
