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
	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

var (
	port              string = "8000"
	exchangeratesURL  string = "https://api.exchangeratesapi.io"
	coinbaseURL       string = "https://api.coinbase.com"
	coinbaseApiKey    string = ""
	coinbaseApiSecret string = ""
	currencyBase      string = coin.USD
)

func LookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func main() {
	flag.StringVar(&port, "port", LookupEnvOrString("PORT", port), "service port")
	flag.StringVar(&coinbaseURL, "coinbase-api-url", LookupEnvOrString("COINBASE_API_URL", coinbaseURL), "set a custom Coinbase api url")
	flag.StringVar(&coinbaseApiKey, "coinbase-api-key", LookupEnvOrString("COINBASE_API_KEY", coinbaseApiKey), "set a custom Coinbase api key")
	flag.StringVar(&coinbaseApiSecret, "coinbase-api-secret", LookupEnvOrString("COINBASE_API_SECRET", coinbaseApiSecret), "set a custom Coinbase api secret")
	flag.StringVar(&currencyBase, "currency-base", LookupEnvOrString("CURRENCY_BASE", currencyBase), "set currency base")

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

	coinService := coin.NewService(currencyBase, coinbaseService, exchangeratesService)

	router := rest.NewRouter(coinService)

	fmt.Fprintf(os.Stdout, tmpl, port)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), router))
}
