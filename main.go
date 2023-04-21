package main

import (
	"github.com/VictorNapoles/challenge-bravo/gateway"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"github.com/VictorNapoles/challenge-bravo/presenter"
	"github.com/VictorNapoles/challenge-bravo/usecase"
)

// @title           Currency and quote Service
// @version         1.0
// @description     A currency and quote management service API in Go using Gin framework.

// @contact.name   Victor de Nápoles
// @contact.url    https://www.linkedin.com/in/victor-n%C3%A1poles-84b61a32/
// @contact.email  victornapoles@hotmail.com

// @host      localhost:8080
func main() {
	infra.LoadInfra()
	gateway.LoadGateways()
	usecase.LoadUsecases()
	presenter.LoadPresenters()

	/*apiClient := gateway.GetAwesomeApiClient()
	  quotes, err := apiClient.GetAvailableQuotes()
	  if err != nil {
	  	return
	  }

	  quoteRepository := gateway.GetQuoteRepository()

	  for key, element := range quotes {
	  	if strings.HasSuffix(key, "USD") || strings.HasPrefix(key, "USD") {

	  		currencyCodes := regexp.MustCompile(`-`).Split(key, -1)
	  		fmt.Println(fmt.Sprintf("%s - %s", key, element))
	  		fmt.Println(fmt.Sprintf("%s - %s", currencyCodes[0], currencyCodes[1]))
	  		//quoteRepository.SetAvailableQuote(currencyCodes[0], currencyCodes[1])
	  		//availableQuote, err2 := quoteRepository.CheckIsAvailableQuote(currencyCodes[0], currencyCodes[1])
	  		//
	  		//if err2 == nil {
	  		//    fmt.Println(fmt.Sprintf("%s - %s", element, availableQuote))
	  		//}

	  		quote, err3 := apiClient.GetQuote(currencyCodes[0], currencyCodes[1])
	  		if err3 == nil {
	  			fmt.Println(fmt.Sprintf("%s - %s", element, quote))
	  		}

	  		quoteRepository.SaveQuote(&repository.QuoteEntity{
	  			From:   quote.From,
	  			To:     quote.To,
	  			Name:   quote.Name,
	  			Amount: quote.Amount,
	  		})

	  		quoteEntity, err4 := quoteRepository.GetQuote(currencyCodes[0], currencyCodes[1])
	  		if err4 == nil {
	  			fmt.Println(fmt.Sprintf("%s - %s", element, quoteEntity))
	  		}

	  	}
	  }*/
}
