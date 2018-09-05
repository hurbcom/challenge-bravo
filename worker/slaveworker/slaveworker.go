package slaveworker

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/yagotome/challenge-bravo/config"
	"github.com/yagotome/challenge-bravo/currency"
	"github.com/yagotome/challenge-bravo/utils/httputil"
	"github.com/yagotome/challenge-bravo/worker"
)

// Run is the function that runs worker task
func Run(p *currency.Price, c config.Config, wgFirstUpdated *sync.WaitGroup) {
	err := updatePrices(p, &c)
	if err != nil {
		log.Panic(err)
	}
	wgFirstUpdated.Done()
	for {
		err = updatePrices(p, &c)
		if err != nil {
			log.Println(err)
		}
		time.Sleep(time.Millisecond * time.Duration(c.SlaveWorker.UpdateInterval))
	}
}

func getPrices(url string) (map[string]float64, error) {
	buf, err := httputil.Get(url)
	if err != nil {
		return nil, err
	}
	data := make(map[string]float64)
	err = json.Unmarshal(buf, &data)
	return data, err
}

// updatePrices updates all prices from master worker API
// That API gives value of 1 USD in each supported currency
func updatePrices(p *currency.Price, conf *config.Config) error {
	resp, err := getPrices(conf.SlaveWorker.MasterWorkerURL)
	if err != nil {
		return err
	}
	for _, c := range worker.SupportedCurrencies {
		if price, ok := resp[c]; ok {
			p.Save(c, price)
		}
	}
	return nil
}
