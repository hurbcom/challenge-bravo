package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"

	"challenge-bravo/pkg/core/log"
	"challenge-bravo/pkg/domains/currencyconversion/model"

	_ "github.com/lib/pq"
)

// RepositoryI is a interface to communicate with a external source of data (ex: Postgres, Firebase FireStore or an API)
// It is using the concept of having a readable interface called "Querier"
// and a Writable interface called "Execer", which exec actions into the external source of data.
type RepositoryI interface {
	// Queries is a "Readeble" interface responsible to read data from source
	Querier

	// Execer is a "Writable" interface responsible for write data into source
	Execer
}

type Querier interface {
	Convert(context.Context, model.ConvertRequest) (model.CurrencyConversion, error)
	FindByID(context.Context, string) (model.CurrencyConversion, error)
	ListCurrencies(context.Context) ([]model.CurrencyConversion, error)
	IsCustom(context.Context, string) bool
}

type Execer interface {
	Upsert(context.Context, *model.CurrencyConversion) error
	Delete(context.Context, string) error
}

type RepositoryMemory struct {
	db  *sql.DB
	log log.Logger
}

func NewRepository(logger log.Logger, db *sql.DB) *RepositoryMemory {
	return &RepositoryMemory{
		db:  db,
		log: logger,
	}
}

func (r *RepositoryMemory) Convert(ctx context.Context, convReq model.ConvertRequest) (model.CurrencyConversion, error) {
	from, err := r.findByID(ctx, convReq.From)
	if err != nil {
		return model.CurrencyConversion{}, err
	}
	to, err := r.findByID(ctx, convReq.To)
	if err != nil {
		return model.CurrencyConversion{}, err
	}
	return model.CurrencyConversion{
		Converted:      true,
		From:           convReq.From,
		To:             convReq.To,
		Amount:         convReq.Amount,
		ConvertedValue: (convReq.Amount * from.USDValue) * to.USDValue,
	}, nil
}

func (r *RepositoryMemory) FindByID(ctx context.Context, id string) (model.CurrencyConversion, error) {
	return r.findByID(ctx, id)
}

func (r *RepositoryMemory) ListCurrencies(ctx context.Context) ([]model.CurrencyConversion, error) {
	var currencies []model.CurrencyConversion
	rows, err := r.db.Query("SELECT id, usd_value FROM currencies")
	if err != nil {
		return currencies, err
	}

	for rows.Next() {
		var currency model.CurrencyConversion

		err = rows.Scan(&currency.ID, &currency.USDValue)
		if err != nil {
			break
		}
		currencies = append(currencies, currency)
	}
	return currencies, nil
}

func (r *RepositoryMemory) Upsert(ctx context.Context, q *model.CurrencyConversion) error {
	update, err := r.db.Prepare("UPDATE currencies SET usd_value = $1 WHERE id = $2")
	if err != nil {
		return err
	}

	result, err := update.Exec(q.USDValue, q.ID)
	if err != nil {
		return err
	}

	affect, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affect == 0 {
		insert, err := r.db.Prepare("INSERT INTO currencies (id, usd_value) VALUES ($1, $2)")
		if err != nil {
			return err
		}

		_, err = insert.Exec(q.ID, q.USDValue)
		if err != nil {
			return err
		}
	}
	return nil
}

func (r *RepositoryMemory) Delete(ctx context.Context, id string) error {
	delete, err := r.db.Prepare("DELETE FROM currencies WHERE id = $1")
	if err != nil {
		return err
	}

	result, err := delete.Exec(id)
	if err != nil {
		return err
	}

	affect, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affect == 0 {
		return fmt.Errorf("não existe nenhuma moeda %s", id)
	}
	return nil
}

func (r *RepositoryMemory) IsCustom(ctx context.Context, id string) bool {
	_, ok := reflect.TypeOf(model.AvailableCurrencies{}).FieldByName(id)
	return !ok
}

func (r *RepositoryMemory) findByID(ctx context.Context, id string) (model.CurrencyConversion, error) {
	var currencyConversion model.CurrencyConversion
	err := r.db.QueryRow("SELECT id, usd_value FROM currencies WHERE id = $1", id).Scan(&currencyConversion.ID, &currencyConversion.USDValue)
	if err != nil {
		if err == sql.ErrNoRows {
			currencyResponse, err := fetchOne(ctx, id)
			if err != nil {
				return currencyConversion, err
			}
			return model.CurrencyConversion{
				ID:       id,
				USDValue: reflect.ValueOf(currencyResponse.Result).FieldByName(id).Float(),
			}, nil
		}
		return currencyConversion, err
	}
	return currencyConversion, nil
}

func fetchOne(ctx context.Context, id string) (model.CurrencyResponse, error) {
	var (
		currencyResponse    = model.CurrencyResponse{}
		endpointAPIFetchOne = os.Getenv("ENDPOINT_API_FETCH_ONE")
		apiKey              = os.Getenv("API_KEY")
		url                 = fmt.Sprintf("%s?to=%s&api_key=%s", endpointAPIFetchOne, id, apiKey)
	)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return currencyResponse, err
	}
	req.Header.Add("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return currencyResponse, err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&currencyResponse)
	if err != nil {
		return currencyResponse, err
	}
	return currencyResponse, nil
}
