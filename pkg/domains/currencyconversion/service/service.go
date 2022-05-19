package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"

	"challenge-bravo/pkg/core/log"
	"challenge-bravo/pkg/domains/currencyconversion/model"
	"challenge-bravo/pkg/domains/currencyconversion/repository"
	"challenge-bravo/pkg/domains/currencyconversion/resterror"
)

//go:generate mockgen -destination service_mock.go -package=currencyConversion -source=service.go
type ServiceI interface {
	Convert(context.Context, model.ConvertRequest) (model.CurrencyConversion, error)
	FindByID(context.Context, string) (model.CurrencyConversion, error)
	ListCurrencies(context.Context) ([]model.CurrencyConversion, error)
	Upsert(context.Context, *model.CurrencyConversion) error
	Delete(context.Context, string) error
}

type Service struct {
	repository repository.RepositoryI
	log        log.Logger
}

func NewService(repository repository.RepositoryI, log log.Logger) (*Service, error) {
	if repository == nil {
		return nil, resterror.ErrEmptyRepository
	}
	return &Service{
		repository: repository,
		log:        log,
	}, nil
}

func (s *Service) Convert(ctx context.Context, convReq model.ConvertRequest) (model.CurrencyConversion, error) {
	if !s.repository.IsCustom(ctx, convReq.From) && !s.repository.IsCustom(ctx, convReq.To) {
		var (
			endpointAPIConvert = os.Getenv("ENDPOINT_API_CONVERT")
			apiKey             = os.Getenv("API_KEY")
			url                = fmt.Sprintf("%s?from=%s&to=%s&amount=%f&api_key=%s", endpointAPIConvert, convReq.From, convReq.To, convReq.Amount, apiKey)
		)

		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			return model.CurrencyConversion{}, err
		}
		req.Header.Add("Accept", "application/json")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return model.CurrencyConversion{}, err
		}
		defer resp.Body.Close()

		var currencyResponse model.CurrencyResponse
		err = json.NewDecoder(resp.Body).Decode(&currencyResponse)
		if err != nil {
			return model.CurrencyConversion{}, err
		}

		return model.CurrencyConversion{
			Converted:      true,
			From:           currencyResponse.Base,
			To:             convReq.To,
			Amount:         currencyResponse.Amount,
			ConvertedValue: reflect.ValueOf(currencyResponse.Result).FieldByName(convReq.To).Float(),
		}, nil
	}
	return s.repository.Convert(ctx, convReq)
}

func (s *Service) FindByID(ctx context.Context, id string) (model.CurrencyConversion, error) {
	return s.repository.FindByID(ctx, id)
}

func (s *Service) ListCurrencies(ctx context.Context) ([]model.CurrencyConversion, error) {
	return s.repository.ListCurrencies(ctx)
}

func (s *Service) Upsert(ctx context.Context, q *model.CurrencyConversion) error {
	if !s.repository.IsCustom(ctx, q.ID) {
		return fmt.Errorf("currency not custom")
	}
	return s.repository.Upsert(ctx, q)
}

func (s *Service) Delete(ctx context.Context, id string) error {
	return s.repository.Delete(ctx, id)
}
