package model

import "time"

// Definição da Estrutura da Moeda
// swagger:model
type Currency struct {
	// Identificador da Moeda (Gerado automaticamente na inclusão)
	// required: true
	ID int64 `json:"id"`
	// Sigla da Moeda
	// required: true
	// min length: 3
	// max length: 10
	// example: BRL
	ShortName string `json:"short_name"`
	// Taxa da Moeda em comparação a Moeda Dolar (USD)
	// required: true
	// example: 1.00
	RateUSD float32 `json:"rate_usd"`
	// Data de Referencia da Taxa
	// required: true
	// example: 2019-08-24T00:00:00Z
	ReferenceDate time.Time `json:"reference_date"`
	// Data de Inclusão da Taxa (Gerado automaticamente na inclusão)
	// required: true
	CreatedAt time.Time `json:"created_at"`
}

type Currencies []Currency

// Definição da Estrutura para Conversão de Moeda
// swagger:model
type CurrencyConvert struct {
	// Sigla da Moeda de Origem
	// required: true
	// min length: 3
	// max length: 10
	// example: USD
	From string
	// Sigla da Moeda de Destino
	// required: true
	// min length: 3
	// max length: 10
	// example: BRL
	To string
	// Valor na Moeda de Origem para ser Convertido
	// required: true
	Amount float32
}

type CurrencyExchangeRate struct {
	ShortName     string
	RateUSD       float32
	ReferenceDate time.Time
}

// Retorna as informações da Moeda
// swagger:response currencyResponse
type currencyResponseWrapper struct {
	// Informações da Moeda
	// in: body
	Body Currency
}

// Retorna as informações de todas as Moedas
// swagger:response currenciesResponse
type currenciesResponseWrapper struct {
	// Informações da Moeda
	// in: body
	Body Currencies
}

type CurrencyConvertResponse struct {
	// Sigla da Moeda de Origem
	// required: true
	// min length: 3
	// max length: 10
	// example: USD
	FromCurrency string
	// Valor na Moeda de Origem para ser Convertido
	// required: true
	FromAmount float32
	// Data de Referencia de Taxa de Conversão da Moeda de Origem
	// required: true
	FromReferenceDate time.Time
	// Sigla da Moeda de Destino
	// required: true
	// min length: 3
	// max length: 10
	// example: BRL
	ToCurrency string
	// Valor na Moeda de Destino
	// required: true
	ToAmount float32
	// Data de Referencia de Taxa de Conversão da Moeda de Destino
	// required: true
	ToReferenceDate time.Time
}

// Retorna as informações referente a conversão
// swagger:response CurrencyConvertResponse
type currencyConvertResponseWrapper struct {
	// Informações da Moeda
	// in: body
	Body CurrencyConvertResponse
}

// swagger:parameters Incluir Alterar
type currencyParametersWrapper struct {
	// Informações da Moeda
	// in: body
	Body struct {
		// Sigla da Moeda
		// required: true
		// min length: 3
		// max length: 10
		// example: BRL
		ShortName string `json:"short_name"`
		// Taxa da Moeda em comparação a Moeda Dolar (USD)
		// required: true
		// example: 1.00
		RateUSD float32 `json:"rate_usd"`
		// Data de Referencia da Taxa
		// required: true
		// example: 2019-08-24T00:00:00Z
		ReferenceDate time.Time `json:"reference_date"`
	}
}

// Excluído com sucesso. (Não retorna nenhum conteúdo)
// swagger:response noContentResponse
type noContentResponseWrapper struct{}

// swagger:parameters Obter Alterar Deletar
type IDParameterWrapper struct {
	// Identificador
	// in: path
	// required: true
	ID int `json:"id"`
}

// swagger:parameters Converter
type CurrencyConvertParameterWrapper struct {
	// Sigla da Moeda de Origem
	// required: true
	// example: USD
	From string `json:"from"`
	// Sigla da Moeda de Destino
	// required: true
	// example: BRL
	To string `json:"to"`
	// Valor na Moeda de Origem
	// required: true
	// example: 1.25
	Amount float32 `json:"amount"`
}
