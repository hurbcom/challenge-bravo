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
	CacheExchangeRate  cache.ExchangeRate
}

func NewExchangeRate(config *util.Config, log hclog.Logger, repositoryCurrency repository.Currency,
	cacheCurrency cache.Currency, cacheExchangeRate cache.ExchangeRate) error {
	exchangeRate := &ExchangeRate{
		Config:             config,
		Log:                log,
		RepositoryCurrency: repositoryCurrency,
		CacheCurrency:      cacheCurrency,
		CacheExchangeRate:  cacheExchangeRate,
	}

	return exchangeRate.GetRate()
}

func (usecaseExchangeRate *ExchangeRate) GetRate() error {
	logTitle := "Exchange Rate"
	cacheKey := "last_update_date"

	lastUpdateDate, err := usecaseExchangeRate.CacheExchangeRate.Get(cacheKey)
	updateDate := time.Now().UTC().Format("2006-01-02")

	if err != nil {
		usecaseExchangeRate.Log.Error(
			logTitle,
			"action", "Loading cache last_update_date",
			"err", err)
	} else if lastUpdateDate == updateDate {
		usecaseExchangeRate.Log.Info(
			logTitle,
			"action", "Validating cache last_update_date",
			"info", "already updated today")
		return nil
	}

	resp, err := http.DefaultClient.Get(usecaseExchangeRate.Config.ExchangeRateURL)

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
				usecaseExchangeRate.Log.Error(logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Loading currency",
					"error", err)
				continue
			}

			currencyExchangeRate.RateUSD = float32(util.MathRoundPrecision(cubeItemRateFloat*rateEUR2USD, 4))
		}

		err = usecaseExchangeRate.RepositoryCurrency.UpdateByExchangeRate(currencyExchangeRate)

		if err != nil {
			if _, ok := err.(repository.ErrNotFound); ok {
				usecaseExchangeRate.Log.Warn(
					logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Update currency in database",
					"warn", "Not updated")
			} else {
				usecaseExchangeRate.Log.Error(
					logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Update currency in database",
					"error", err)
			}
		} else {
			err = usecaseExchangeRate.CacheCurrency.DelByShortName(currencyExchangeRate.ShortName)

			if err != nil {
				usecaseExchangeRate.Log.Error(
					logTitle,
					"currency", fmt.Sprintf("%+v", currencyExchangeRate),
					"action", "Delete currency from cache",
					"error", err)
			}

			usecaseExchangeRate.Log.Info(
				logTitle,
				"currency", fmt.Sprintf("%+v", currencyExchangeRate),
				"info", "Currency successfuly updated")
		}
	}

	err = usecaseExchangeRate.CacheExchangeRate.Set(cacheKey, updateDate)

	if err != nil {
		usecaseExchangeRate.Log.Error(
			logTitle,
			"action", "Updating cache last_update_date",
			"error", err)
	}

	usecaseExchangeRate.Log.Info(
		logTitle,
		"info", "Currency finish successfuly updated")

	return nil
}
