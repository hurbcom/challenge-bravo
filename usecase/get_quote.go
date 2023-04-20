package usecase

import (
	"fmt"
	"github.com/VictorNapoles/challenge-bravo/domain"
	"github.com/VictorNapoles/challenge-bravo/gateway/repository"
)

type (
	GetQuoteDto struct {
		From   string
		To     string
		Amount float64
	}

	GetQuote interface {
		Execute(dto *GetQuoteDto) (*domain.Quote, error)
	}

	getQuoteImpl struct {
		currencyRepository repository.CurrencyRepository
		getExternalQuote   GetExternalQuote
	}
)

func NewGetQuote(currencyRepository repository.CurrencyRepository, getExternalQuote GetExternalQuote) GetQuote {
	return &getQuoteImpl{currencyRepository: currencyRepository, getExternalQuote: getExternalQuote}
}

func (g *getQuoteImpl) Execute(dto *GetQuoteDto) (*domain.Quote, error) {
	fromCurrencyEntity, err := g.currencyRepository.GetByCode(dto.From)
	if err != nil {
		return nil, err
	}

	if fromCurrencyEntity.Code == "" {
		return nil, &UsecaseError{Message: g.getCurrencyNotFoundMessage(dto.From)}
	}

	fromBankCurrencyValue, err := g.getBankCurrencyValue(fromCurrencyEntity)
	if err != nil {
		return nil, err
	}

	toCurrencyEntity, err := g.currencyRepository.GetByCode(dto.To)
	if err != nil {
		return nil, err
	}

	if toCurrencyEntity.Code == "" {
		return nil, &UsecaseError{Message: g.getCurrencyNotFoundMessage(dto.To)}
	}

	toBankCurrencyValue, err := g.getBankCurrencyValue(toCurrencyEntity)
	if err != nil {
		return nil, err
	}

	quoteAmount := fromBankCurrencyValue * toBankCurrencyValue

	return &domain.Quote{
		From:   dto.From,
		To:     dto.To,
		Name:   fmt.Sprintf("%s/%s", fromCurrencyEntity.CurrencyName, toCurrencyEntity.CurrencyName),
		Amount: quoteAmount,
	}, nil

}

func (g *getQuoteImpl) getBankCurrencyValue(fromCurrencyEntity *repository.CurrencyEntity) (float64, error) {

	quoteType := g.getQuoteType(fromCurrencyEntity)

	if quoteType == domain.QuoteToBankCurrency || quoteType == domain.QuoteFromBankCurrency {
		quote, err := g.getExternalQuote.Execute(&GetExternalQuoteDto{
			CurrencyCode: fromCurrencyEntity.Code,
			QuoteType:    quoteType,
		})
		if err != nil {
			return 0, err
		}

		return quote.Amount, err
	}
	return fromCurrencyEntity.UnitValueBankCurrency, nil
}

func (g *getQuoteImpl) getCurrencyNotFoundMessage(currencyCode string) string {
	return fmt.Sprintf("Currency %s not found", currencyCode)
}

func (g *getQuoteImpl) getQuoteType(entity *repository.CurrencyEntity) domain.QuoteType {
	switch entity.QuoteType {
	case repository.QuoteToBankCurrency:
		return domain.QuoteToBankCurrency
	case repository.QuoteFromBankCurrency:
		return domain.QuoteFromBankCurrency
	default:
		return domain.QuoteNotAvailable
	}
}
