package model

import "time"

// Definição da Estrutura da Moeda
// swagger:model
type Currency struct {
	// Identificador da Moeda (Gerado automaticamente na inclusão)
	ID int64 `json:"id"`
	// Sigla da Moeda
	// required: true
	// min length: 3
	// max length: 10
	// example: "USD", "EUR", "BRL", etc
	ShortName string `json:"short_name"`
	// Taxa da Moeda em comparação a Moeda Dolar (USD)
	// required: true
	// example: tem que ser diferente de 0 (zero)
	RateUSD float32 `json:"rate_usd"`
	// Data de Referencia da Taxa
	// required: true
	// example: Entre 01/01/1900 até a data corrente
	ReferenceDate time.Time `json:"reference_date"`
	// Data de Inclusão da Taxa (Gerado automaticamente na inclusão)
	CreatedAt time.Time `json:"created_at"`
}

type Currencies []Currency

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
