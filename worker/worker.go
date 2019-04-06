package worker

import (
	"strconv"
	"time"

	"github.com/hurbcom/challenge-bravo/config"
	"github.com/hurbcom/challenge-bravo/controller"
	"github.com/hurbcom/challenge-bravo/db"
	"github.com/hurbcom/challenge-bravo/log"
	coinmarket "github.com/hurbcom/challenge-bravo/plugin/coinmarketcap"
	"github.com/hurbcom/challenge-bravo/plugin/fixer"
)

//Run executes the worker that updates the
//currency quotes at intervals of time
func Run() {

	cc := controller.CurrencyController{
		API: fixer.Fixer{
			Caller: &fixer.FixerCaller{
				Endpoint:  config.Config["FIXER_ENDPOINT"],
				AccessKey: config.Config["FIXER_ACCESS_KEY"],
			},
		},
		CryptoAPI: coinmarket.CoinMarketCap{
			Caller: &coinmarket.CoinMarketCaller{
				Endpoint:  config.Config["COINMARKET_ENDPOINT"],
				AccessKey: config.Config["COINMARKET_ACCESS_KEY"],
			},
		},
	}

	redis := db.Redis{
		Address: config.Config["DB_ADDRESS"],
		Port:    config.Config["DB_PORT"],
		Pass:    config.Config["DB_PASS"],
	}

	redis.Connect()

	dc := controller.DBController{
		Database: &redis,
	}

	refreshInterval, err := strconv.Atoi(config.Config["REFRESH_INTERVAL"])
	if err != nil {
		log.Fatal(err.Error(), "worker")
	}
	for {
		data := getData(cc)
		if data != nil {
			setKeys(dc, data)
			log.Info("Data updated", "worker")
		}
		time.Sleep(time.Minute * time.Duration(refreshInterval))
	}
}

//getData gets the currency quotes of the 2 APIs
func getData(cc controller.CurrencyController) map[string]float64 {

	result, err := cc.GetRates()

	if err != nil {
		result = make(map[string]float64)
		log.Error(err.Error(), "worker")
	}

	cryptoResult, err := cc.GetCryptoRates()

	if err != nil {
		log.Error(err.Error(), "worker")
	}

	for key, value := range cryptoResult {
		result[key] = value
	}
	if len(result) == 0 {
		return nil
	}

	return result

}

//setKeys stores the data into database
func setKeys(dc controller.DBController, data map[string]float64) {
	if err := dc.SetRates(data); err != nil {
		log.Error(err.Error(), "worker")
	}
}
