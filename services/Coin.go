package services

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/hurbcom/challenge-bravo/dao"
	"github.com/hurbcom/challenge-bravo/models"
)

//CreateCoin  Add the coin in the pool
func CreateCoin(newCoin models.Coin) (*models.Coin, error) {
	var verify models.VerifyCoin
	newCoin.Symbol = strings.ToUpper(newCoin.Symbol)
	if dao.StoreContains(newCoin) {
		return &newCoin, nil
	}
	if _, err := dao.GetCoinExist(newCoin.Symbol); err != nil {
		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map", nil)
		if err != nil {
			return nil, err
		}

		q := url.Values{}
		q.Add("symbol", strings.ToUpper(newCoin.Symbol))

		req.Header.Set("Accepts", "application/json")
		req.Header.Add("X-CMC_PRO_API_KEY", os.Getenv("EXTERNAL_API_KEY"))
		req.URL.RawQuery = q.Encode()

		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}

		if resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			respBody, _ := ioutil.ReadAll(resp.Body)
			json.Unmarshal(respBody, &verify)
			if verify.Status.ErrorCode == 0 {
				dao.CreteCoin(newCoin)
				return &newCoin, nil
			}
			return nil, errors.New("May be this Symbol does not exist")
		}
		return nil, errors.New("OOPS request error")
	}

	dao.CreteCoin(newCoin)
	return &newCoin, nil
}

//DeleteCoin remove the coin in the pool
func DeleteCoin(coin models.Coin) error {
	coin.Symbol = strings.ToUpper(coin.Symbol)
	return dao.DeleteCoin(coin)
}
