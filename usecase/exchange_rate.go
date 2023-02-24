package usecase

import (
	"encoding/xml"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/util"
	"github.com/hashicorp/go-hclog"
)

type ExchangeRate struct {
	Config             *util.Config
	Log                hclog.Logger
	RepositoryCurrency repository.Currency
	CacheCurrency      cache.Currency
}

func NewExchangeRate(config *util.Config, log hclog.Logger, repositoryCurrency repository.Currency, cacheCurrency cache.Currency) error {
	exchangeRate := &ExchangeRate{
		Config:             config,
		Log:                log,
		RepositoryCurrency: repositoryCurrency,
		CacheCurrency:      cacheCurrency,
	}

	return exchangeRate.GetRate()
}

func (exchangeRate *ExchangeRate) GetRate() error {
	logTitle := "Exchange Rate"
	resp, err := http.DefaultClient.Get(exchangeRate.Config.ExchangeRateURL)

	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		err = errors.New(fmt.Sprintf("Response invalid status code: %v", resp.StatusCode))
		return err
	}

	defer resp.Body.Close()

	exchangeRateModel := &model.ExchangeRate{}

	err = xml.NewDecoder(resp.Body).Decode(&exchangeRateModel)

	if err != nil {
		return err
	}

	exchangeRateReferenceDate, err := time.Parse("2006-01-02", exchangeRateModel.Cube.Time)

	if err != nil {
		return err
	}

	var rateEUR2USD float64
	// find USD currency to use as ballast
	for _, cubeItem := range exchangeRateModel.Cube.Items {
		if cubeItem.Currency == "USD" {
			rateUSD2EUR, _ := strconv.ParseFloat(cubeItem.Rate, 32)
			diffUSD2EUR := util.MathRoundPrecision(rateUSD2EUR-1, 4)
			rateEUR2USD = util.MathRoundPrecision(1-diffUSD2EUR, 4)
			break
		}
	}

	if rateEUR2USD == 0 {
		err = errors.New("USD currency not found to use as ballast")
		return err
	}

	// update Currency EUR
	exchangeRateEURCubeItem := model.ExchangeRateCubeItem{
		Currency: "EUR",
		Rate:     fmt.Sprintf("%.4f", rateEUR2USD),
	}

	exchangeRateModel.Cube.Items = append(exchangeRateModel.Cube.Items, exchangeRateEURCubeItem)

	for _, cubeItem := range exchangeRateModel.Cube.Items {
		currencyExchangeRate := &model.CurrencyExchangeRate{
			ShortName:     cubeItem.Currency,
			ReferenceDate: exchangeRateReferenceDate,
		}
		if cubeItem.Currency == "USD" {
			currencyExchangeRate.RateUSD = 1
		} else if cubeItem.Currency == "EUR" {
			currencyExchangeRate.RateUSD = float32(rateEUR2USD)
		} else {
			cubeItemRateFloat, err := strconv.ParseFloat(cubeItem.Rate, 32)

			if err != nil {
				exchangeRate.Log.Error(logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Loading currency",
					"error", err)
				continue
			}

			currencyExchangeRate.RateUSD = float32(util.MathRoundPrecision(cubeItemRateFloat*rateEUR2USD, 4))
		}

		err = exchangeRate.RepositoryCurrency.UpdateByExchangeRate(currencyExchangeRate)

		if err != nil {
			if _, ok := err.(repository.ErrNotFound); ok {
				exchangeRate.Log.Warn(
					logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Update currency in database",
					"warn", "Not updated")
			} else {
				exchangeRate.Log.Error(
					logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Update currency in database",
					"error", err)
			}
		} else {
			_, err = exchangeRate.CacheCurrency.GetByShortName(currencyExchangeRate.ShortName)

			if err == nil {
				err = exchangeRate.CacheCurrency.DelByShortName(currencyExchangeRate.ShortName)

				if err != nil {
					exchangeRate.Log.Warn(
						logTitle,
						"currency", fmt.Sprintf("%+v", currencyExchangeRate),
						"action", "Delete currency from cache",
						"warn", err)
				}
			}

			exchangeRate.Log.Info(
				logTitle,
				"currency", fmt.Sprintf("%+v", currencyExchangeRate),
				"info", "Currency successfuly updated")
		}
	}

	return nil
}
