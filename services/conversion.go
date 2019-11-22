package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/hurbcom/challenge-bravo/models"
)

//Convert recive a CoinExchange with origin origin coin, dest coin and amount to convert
func Convert(coin models.CoinExchange) (float64, error) {
	//price fo Coins in USD
	var priceFrom, PriceTo float64

	coin.To = strings.ToUpper(coin.To)
	coin.From = strings.ToUpper(coin.From)
	if err := dao.ValidateCoinExchange(coin); err != nil {
		return 0.0, err
	}
	//if has in cache get the cache value else do th request to external api
	priceFromStr, err := dao.GetCoinValue(models.Coin{Symbol: coin.From})
	if err != nil {
		priceFrom, err = requestAttCoins(coin.From)
		if err != nil {
			return 0.00, err
		}
		dao.CreateCacheCoinValues(models.Coin{Symbol: coin.From}, fmt.Sprintf("%f", priceFrom))
	} else {
		priceFrom, err = strconv.ParseFloat(priceFromStr, 64)
		if err != nil {
			return 0.00, err
		}
	}
	//if has in cache get the cache value else do th request to external api
	priceToStr, err := dao.GetCoinValue(models.Coin{Symbol: coin.To})
	if err != nil {
		PriceTo, err = requestAttCoins(coin.To)
		if err != nil {
			return 0.00, err
		}
		dao.CreateCacheCoinValues(models.Coin{Symbol: coin.To}, fmt.Sprintf("%f", PriceTo))
	} else {
		PriceTo, err = strconv.ParseFloat(priceToStr, 64)
		if err != nil {
			return 0.00, err
		}
	}

	amountInBTC := coin.Amount / priceFrom
	convertdValues := amountInBTC * PriceTo

	return convertdValues, nil
}

//requestAttCoins request get reference price of the coin
func requestAttCoins(ref string) (float64, error) {
	if ref == "USD" {
		return 1.00, nil
	}
	client := &http.Client{}
	var Coinref models.ResultCoinRequest
	req, err := http.NewRequest("GET", "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest", nil)
	if err != nil {
		return 0.00, err
	}

	q := url.Values{}
	q.Add("id", "2781")
	q.Add("convert", ref)

	req.Header.Set("Accepts", "application/json")
	req.Header.Add("X-CMC_PRO_API_KEY", os.Getenv("EXTERNAL_API_KEY"))
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		return 0.00, errors.New("Error sending request to server")

	}
	respBody, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	err = json.Unmarshal(respBody, &Coinref)
	if err != nil {
		return 0.00, err
	}
	return Coinref.Data.Dollar.Quote[ref].Price, nil
}
