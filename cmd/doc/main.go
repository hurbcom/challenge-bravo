package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/hurbcom/challenge-bravo/adapter/primary/http/static"
)

var port string = "8001"

func LookupEnvOrString(key string, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultVal
}

func main() {
	flag.StringVar(&port, "port", LookupEnvOrString("PORT", port), "service port")

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

	router, err := static.NewRouter()
	if err != nil {
		panic(err)
	}

	fmt.Fprintf(os.Stdout, tmpl, port)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), router))
}
