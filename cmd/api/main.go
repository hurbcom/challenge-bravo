package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/hurbcom/challenge-bravo/adapter/primary/http/rest"
	"github.com/hurbcom/challenge-bravo/adapter/secondary/http/coinbase"
	"github.com/hurbcom/challenge-bravo/adapter/secondary/http/exchangerates"
	"github.com/hurbcom/challenge-bravo/pkg/config"
	"github.com/hurbcom/challenge-bravo/pkg/currency"
)

var (
	port              string = "8000"
	exchangeratesURL  string = "https://api.exchangeratesapi.io"
	coinbaseURL       string = "https://api.coinbase.com"
	coinbaseApiKey    string = ""
	coinbaseApiSecret string = ""
	currencyBase      string = currency.USD
)

func main() {
	flag.StringVar(&port, "port", config.LookupEnvOrString("PORT", port), "service port")
	flag.StringVar(&exchangeratesURL, "exchangerates-api-url", config.LookupEnvOrString("EXCHANGESRATES_API_URL", exchangeratesURL), "set a custom Exchangerates api url")
	flag.StringVar(&coinbaseURL, "coinbase-api-url", config.LookupEnvOrString("COINBASE_API_URL", coinbaseURL), "set a custom Coinbase api url")
	flag.StringVar(&coinbaseApiKey, "coinbase-api-key", config.LookupEnvOrString("COINBASE_API_KEY", coinbaseApiKey), "set a custom Coinbase api key")
	flag.StringVar(&coinbaseApiSecret, "coinbase-api-secret", config.LookupEnvOrString("COINBASE_API_SECRET", coinbaseApiSecret), "set a custom Coinbase api secret")
	flag.StringVar(&currencyBase, "currency-base", config.LookupEnvOrString("CURRENCY_BASE", currencyBase), "set currency base")

	flag.Parse()

	tmpl := `
 __   __  __   __  ______    _______
|  | |  ||  | |  ||    _ |  |  _    |
|  |_|  ||  | |  ||   | ||  | |_|   |
|       ||  |_|  ||   |_||_ |       |
|       ||       ||    __  ||  _   |
|   _   ||       ||   |  | || |_|   |
|__| |__||_______||___|  |_||_______|

 Server's running on port :%v

`

	coinbaseService := coinbase.NewService(coinbaseURL, coinbaseApiKey, coinbaseApiSecret)
	exchangeratesService := exchangerates.NewService(exchangeratesURL)

	currencyService := currency.NewService(currencyBase, coinbaseService, exchangeratesService)

	router := rest.NewRouter(currencyService)

	fmt.Fprintf(os.Stdout, tmpl, port)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), router))
}
