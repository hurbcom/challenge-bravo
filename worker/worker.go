// Package worker provide a worker that updates a given Price data structure
// with current prices of supported currencies
// Prices are gotten from openexchangesrates API and coinmaketcap
// (Etherium price will be treated differently from the others)
package worker

import (
	"github.com/yagotome/challenge-bravo/utils/sliceutil"
)

// EthSymbol is the symbol of Etherium
const EthSymbol = "ETH"

// SupportedCurrencies have supported currency symbols
var SupportedCurrencies = []string{
	"USD",
	"BRL",
	"EUR",
	"BTC",
	EthSymbol,
}

// IsSupported returns if a currency is supported by the worker
func IsSupported(curSymb string) bool {
	return sliceutil.Contains(SupportedCurrencies, curSymb)
}
