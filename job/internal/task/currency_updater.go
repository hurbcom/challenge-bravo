package task

import (
	"context"
	"fmt"
	"net/http"

	"github.com/wesleyfebarretos/challenge-bravo/job/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/service"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/scheduler"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/types"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/cache_keys"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
)

type CurrencyUpdater struct{}

func (j CurrencyUpdater) AddToScheduler() {

	currencyUpdater := func() {
		fmt.Println("[CURRENCY UPDATER TASK STARTING...]")
		ctx := context.Background()

		if err := j.Run(ctx); err != nil {
			fmt.Printf("[CURRENCY UPDATE TASK ERROR]: %v\n", err)
			return
		}

		fmt.Println("[CURRENCY UPDATER TASK FINISHED]")
	}

	scheduler.New().AddTask(enum.CurrencyUpdaterTask, "@every 12h", currencyUpdater)
}

func (c CurrencyUpdater) Run(ctx context.Context) error {

	err := service.NewCurrencyUpdaterService(http.Client{}).UpdateRates(ctx)
	if err != nil {
		return err
	}

	currencies := []types.Currency{}

	query := "SELECT code, usd_exchange_rate FROM currency;"

	rows, err := db.Conn.Query(ctx, query)
	if err != nil {
		return err
	}

	for rows.Next() {
		currency := types.Currency{}

		err := rows.Scan(&currency.Code, &currency.USDExchangeRate)

		if err != nil {
			fmt.Printf("[CURRENCY UPDATE TASK ERROR]: %v\n", err)
			continue
		}

		currencies = append(currencies, currency)
	}

	currenciesRateMap := map[string]float64{}

	for _, v := range currencies {
		currenciesRateMap[v.Code] = v.USDExchangeRate
	}

	err = aredis.Set(ctx, cache_keys.CURRENCIES_RATE_MAP, currenciesRateMap, 0)
	if err != nil {
		return err
	}

	return nil
}

func NewCurrencyUpdater() CurrencyUpdater {
	return CurrencyUpdater{}
}
