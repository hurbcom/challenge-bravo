package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	primaryrest "github.com/hurbcom/challenge-bravo/adapter/primary/http/rest"
	secondaryrest "github.com/hurbcom/challenge-bravo/adapter/secondary/http/rest"
	"github.com/hurbcom/challenge-bravo/pkg/coin"
)

var (
	port              string = "8000"
	coinbaseApiKey    string = ""
	coinbaseApiSecret string = ""
)

func LookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func main() {
	flag.StringVar(&port, "port", LookupEnvOrString("PORT", port), "service port")
	flag.StringVar(&coinbaseApiKey, "coinbase-api-key", LookupEnvOrString("COINBASE_API_KEY", coinbaseApiKey), "set a custom Coinbase api key")
	flag.StringVar(&coinbaseApiSecret, "coinbase-api-secret", LookupEnvOrString("COINBASE_API_SECRET", coinbaseApiSecret), "set a custom Coinbase api secret")

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

	coinQuerierService := secondaryrest.NewService(coinbaseApiKey, coinbaseApiSecret)

	coinService := coin.NewService(coinQuerierService)

	router := primaryrest.NewRouter(coinService)

	fmt.Fprintf(os.Stdout, tmpl, port)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), router))
}
