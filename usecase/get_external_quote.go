package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/awesomeapi"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
	env "github.com/VictorNapoles/challenge-bravo/infra/environment"
	"strconv"
)

type (
	GetExternalQuoteDto struct {
		CurrencyCode string
		QuoteType    domain.QuoteType
	}
	GetExternalQuote interface {
		Execute(dto *GetExternalQuoteDto) (*domain.Quote, error)
	}

	getExternalQuoteImpl struct {
		quoteRepository  repository.QuoteRepository
		awesomeApiClient awesomeapi.AwesomeApiClient
		environment      env.Environment
	}
)

func (s *getExternalQuoteImpl) Execute(dto *GetExternalQuoteDto) (*domain.Quote, error) {
	bankCurrencyCode, err := s.environment.Get(BANK_CURRENCY_CODE_ENV_VAR)

	if err != nil {
		return &domain.Quote{}, err
	}

	switch dto.QuoteType {
	case domain.QuoteToBankCurrency:
		return s.getQuoteToBankCurrency(dto, bankCurrencyCode)
	case domain.QuoteFromBankCurrency:
		return s.getQuoteFromBankCurrency(dto, bankCurrencyCode)
	default:
		return &domain.Quote{}, UsecaseError{
			Message: "Invalid quote type",
		}
	}
}

func (s getExternalQuoteImpl) getQuoteToBankCurrency(dto *GetExternalQuoteDto, bankCurrencyCode string) (*domain.Quote, error) {
	externalQuoteCache, err := s.quoteRepository.GetQuote(dto.CurrencyCode, bankCurrencyCode)

	if err != nil {
		return &domain.Quote{}, err
	}

	if externalQuoteCache.Amount != "" {
		amount, err := strconv.ParseFloat(externalQuoteCache.Amount, 64)
		if err != nil {
			return &domain.Quote{}, err
		}

		return &domain.Quote{
			From:   externalQuoteCache.From,
			To:     externalQuoteCache.To,
			Name:   externalQuoteCache.Name,
			Amount: amount,
		}, nil

	}

	externalQuote, err := s.awesomeApiClient.GetQuote(dto.CurrencyCode, bankCurrencyCode)
	if err != nil {
		return &domain.Quote{}, err
	}

	amount, err := strconv.ParseFloat(externalQuote.Amount, 64)
	if err != nil {
		return &domain.Quote{}, err
	}
	return &domain.Quote{
		From:   externalQuote.From,
		To:     externalQuote.To,
		Name:   externalQuote.Name,
		Amount: amount,
	}, nil

}

func (s getExternalQuoteImpl) getQuoteFromBankCurrency(dto *GetExternalQuoteDto, bankCurrencyCode string) (*domain.Quote, error) {
	externalQuoteCache, err := s.quoteRepository.GetQuote(bankCurrencyCode, dto.CurrencyCode)

	if err != nil {
		return &domain.Quote{}, err
	}

	if externalQuoteCache.Amount != "" {
		amount, err := strconv.ParseFloat(externalQuoteCache.Amount, 64)
		if err != nil {
			return &domain.Quote{}, err
		}

		return &domain.Quote{
			From:   externalQuoteCache.From,
			To:     externalQuoteCache.To,
			Name:   externalQuoteCache.Name,
			Amount: float64(1) / amount,
		}, nil

	}

	externalQuote, err := s.awesomeApiClient.GetQuote(bankCurrencyCode, dto.CurrencyCode)
	if err != nil {
		return &domain.Quote{}, err
	}

	amount, err := strconv.ParseFloat(externalQuote.Amount, 64)
	if err != nil {
		return &domain.Quote{}, err
	}
	return &domain.Quote{
		From:   externalQuote.From,
		To:     externalQuote.To,
		Name:   externalQuote.Name,
		Amount: float64(1) / amount,
	}, nil

}
