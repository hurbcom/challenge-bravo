package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/types"
	"github.com/wesleyfebarretos/challenge-bravo/pkg/utils"
)

type CurrencyUpdaterService struct {
	client http.Client
}

func NewCurrencyUpdaterService(client http.Client) CurrencyUpdaterService {
	return CurrencyUpdaterService{}
}

func (c CurrencyUpdaterService) getExchangeRatesInUSD(ctx context.Context) ([]*types.Currency, error) {

	usd := types.Currency{}

	query := "SELECT code, search_url, response_path_to_rate FROM currency WHERE code = $1"

	db.Conn.QueryRow(ctx, query, "USD").Scan(&usd.Code, &usd.SearchURL, &usd.ResponsePathToRate)

	req, err := http.NewRequest(http.MethodGet, *usd.SearchURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	res, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}

	dataB, err := io.ReadAll(res.Body)

	if err != nil {
		return nil, err
	}

	usdExchangeRatesMap := map[string]any{}

	err = json.Unmarshal(dataB, &usdExchangeRatesMap)
	if err != nil {
		return nil, err
	}

	usdExchangeRatesMap = usdExchangeRatesMap["rates"].(map[string]any)

	query = "SELECT id, code FROM currency WHERE search_url IS NULL"

	currencies := []*types.Currency{}

	rows, err := db.Conn.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		currency := &types.Currency{}

		err := rows.Scan(&currency.ID, &currency.Code)
		if err != nil {
			return nil, err
		}

		currencies = append(currencies, currency)
	}

	updatedCurrencies := []*types.Currency{}

	for _, v := range currencies {
		rate, ok := usdExchangeRatesMap[v.Code]
		if ok {
			value := 1 / rate.(float64)
			v.USDExchangeRate = utils.RoundFloat(value, 2)

			updatedCurrencies = append(updatedCurrencies, v)

		}
	}

	return updatedCurrencies, nil
}

func (c CurrencyUpdaterService) getExchangeRatesBasedInSearchUrl(ctx context.Context) ([]*types.Currency, error) {
	query := `
        SELECT
            id, code, search_url, response_path_to_rate
        FROM
            currency
        WHERE
            search_url IS NOT NULL
        AND
            response_path_to_rate IS NOT NULL
        AND
            code != 'USD';
    `

	rows, err := db.Conn.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	currencies := []*types.Currency{}

	for rows.Next() {
		currency := &types.Currency{}

		err := rows.Scan(&currency.ID, &currency.Code, &currency.SearchURL, &currency.ResponsePathToRate)
		if err != nil {
			return nil, err
		}

		currencies = append(currencies, currency)
	}

	for _, currency := range currencies {
		req, err := http.NewRequest(http.MethodGet, *currency.SearchURL, nil)
		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", currency.Code, err)
			continue
		}

		req.Header.Set("Content-Type", "application/json")

		res, err := c.client.Do(req)
		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", currency.Code, err)
			continue
		}

		dataB, err := io.ReadAll(res.Body)

		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", currency.Code, err)
			continue
		}

		response := map[string]any{}

		err = json.Unmarshal(dataB, &response)
		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", currency.Code, err)
			continue
		}

		rate, err := c.getRateFromResponse(response, *currency.ResponsePathToRate)
		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", currency.Code, err)
			continue
		}

		currency.USDExchangeRate = rate
	}

	return currencies, nil
}

func (c CurrencyUpdaterService) UpdateRates(ctx context.Context) error {
	fiatCurrencies, err := c.getExchangeRatesInUSD(ctx)
	if err != nil {
		return err
	}

	otherCurrencies, err := c.getExchangeRatesBasedInSearchUrl(ctx)
	if err != nil {
		return err
	}

	currencies := []*types.Currency{}
	currencies = append(currencies, fiatCurrencies...)
	currencies = append(currencies, otherCurrencies...)

	tx, err := db.Conn.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for _, v := range currencies {
		if v.USDExchangeRate == 0 {
			continue
		}

		query := `
            UPDATE currency
            SET
                usd_exchange_rate = $2,
                updated_at = $3,
                updated_by = 1
            WHERE
                id = $1`

		_, err := tx.Exec(ctx, query, v.ID, v.USDExchangeRate, time.Now().UTC())
		if err != nil {
			fmt.Printf("currency [%s] error: %v\n", v.Code, err)
			continue
		}
	}

	tx.Commit(ctx)

	return nil
}

func (c CurrencyUpdaterService) getRateFromResponse(response map[string]any, ratePath string) (float64, error) {
	path := strings.Split(ratePath, ";")

	for i := 0; i < len(path)-1; i++ {

		key := path[i]
		nextPath, ok := response[key].(map[string]any)
		if !ok {
			return 1, fmt.Errorf("wrong response path persisted in database")
		}

		response = nextPath
	}

	rate := response[path[len(path)-1]]

	switch r := rate.(type) {
	case string:
		floatRate, err := strconv.ParseFloat(r, 64)

		if err != nil {
			return 1, err
		}

		rate = floatRate
	}

	return rate.(float64), nil
}
