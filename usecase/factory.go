package usecase

import (
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
)

const (
	BankCurrencyCodeEnvVar = "BANK_CURRENCY_CODE"
)

type (
	UsecaseError struct {
		Message string
	}
)

var (
	getExternalQuote         GetExternalQuote
	getQuoteFromBankCurrency GetQuoteFromBankCurrency
	getQuoteToBankCurrency   GetQuoteToBankCurrency
	getQuoteType             GetQuoteType
	validateNewCurrency      ValidateNewCurrency
	saveCurrency             SaveCurrency
	deleteCurrency           DeleteCurrency
	getQuote                 GetQuote
)

func (u *UsecaseError) Error() string {
	return u.Message
}

func loadGetExternalQuote() {
	getExternalQuote = NewGetExternalQuote(gateway.GetQuoteRepository(), gateway.GetAwesomeApiClient(), infra.GetEnvironment())
}

func loadGetQuoteFromBankCurrency() {
	getQuoteFromBankCurrency = NewGetQuoteFromBankCurrency(GetExternalQuoteUsecase())
}
func loadGetQuoteToBankCurrency() {
	getQuoteToBankCurrency = NewGetQuoteToBankCurrency(GetExternalQuoteUsecase())
}
func loadGetQuoteType() {
	getQuoteType = NewGetQuoteType(gateway.GetQuoteRepository(), infra.GetEnvironment())
}
func loadSaveCurrency() {
	saveCurrency = NewSaveCurrency(infra.GetEnvironment(), gateway.GetCurrencyRepository(), ValidateNewCurrencyUsecase(), GetQuoteTypeUsecase(), GetQuoteToBankCurrencyUsecase(), GetQuoteFromBankCurrencyUsecase())
}
func loadValidateNewCurrency() {
	validateNewCurrency = NewValidateNewCurrency(gateway.GetCurrencyRepository())
}
func loadDeleteCurrency() {
	deleteCurrency = NewDeleteCurrency(gateway.GetCurrencyRepository())
}
func loadGetQuote() {
	getQuote = NewGetQuote(gateway.GetCurrencyRepository(), GetExternalQuoteUsecase())
}

func LoadUsecases() {
	loadGetExternalQuote()
	loadGetQuoteFromBankCurrency()
	loadGetQuoteToBankCurrency()
	loadGetQuoteType()
	loadValidateNewCurrency()
	loadSaveCurrency()
	loadDeleteCurrency()
}

func GetExternalQuoteUsecase() GetExternalQuote {
	if getExternalQuote == nil {
		loadGetExternalQuote()
	}
	return getExternalQuote
}

func GetQuoteFromBankCurrencyUsecase() GetQuoteFromBankCurrency {

	if getQuoteFromBankCurrency == nil {
		loadGetQuoteFromBankCurrency()
	}
	return getQuoteFromBankCurrency
}
func GetQuoteToBankCurrencyUsecase() GetQuoteToBankCurrency {

	if getQuoteToBankCurrency == nil {
		loadGetQuoteToBankCurrency()
	}
	return getQuoteToBankCurrency
}
func GetQuoteTypeUsecase() GetQuoteType {

	if getQuoteType == nil {
		loadGetQuoteType()
	}
	return getQuoteType
}
func ValidateNewCurrencyUsecase() ValidateNewCurrency {

	if validateNewCurrency == nil {
		loadValidateNewCurrency()
	}
	return validateNewCurrency
}
func SaveCurrencyUsecase() SaveCurrency {

	if saveCurrency == nil {
		loadSaveCurrency()
	}
	return saveCurrency
}
func DeleteCurrencyUsecase() DeleteCurrency {

	if deleteCurrency == nil {
		loadDeleteCurrency()
	}
	return deleteCurrency
}
func GetQuoteUsecase() GetQuote {

	if getQuote == nil {
		loadGetQuote()
	}
	return getQuote
}
