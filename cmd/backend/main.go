package main

import (
	"challenge-bravo/dao"
	"challenge-bravo/model"
	"challenge-bravo/server"
	"challenge-bravo/services"
	"flag"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// webConfig Server configuration parameters
var webConfig server.Config

// servicesConfig Currency and Cryptocurrency quote services parameters
var servicesConfig services.Config

// Model configuration Variables
var (
	dbConnectionString    string // dbConnectionString Database connection string (Postgres)
	cacheConnectionString string // cacheConnectionString CacheContainer connection string (Redis)
)

// main Program entry point
func main() {

	// Read the program's configuration
	readConfig()

	// Initalize data layer
	if err := dao.Init(dbConnectionString, cacheConnectionString); err != nil {
		os.Exit(1)
	}

	// Initialize services
	if err := services.Init(servicesConfig); err != nil {
		dao.Terminate()
		os.Exit(1)
	}

	// start http server
	server.Start(webConfig)

	// Gracefully terminate data layer and currency quote services
	dao.Terminate()
	services.Terminate()
}

// init the application.
// - Read parameters from environment variables, and set as default values (will be overridden by command line parameters)
// - Initalize data layer (database and cache)
func init() {

	// Read parameters from environment variables
	webConfig.Port = model.DefaultPort
	if strPort, ok := os.LookupEnv(model.EnvPortKey); ok {
		if port, err := strconv.Atoi(strPort); err == nil && port >= 0 && port <= 0xffff {
			webConfig.Port = port
		}
	}

	if host, ok := os.LookupEnv(model.EnvHostKey); ok {
		webConfig.Host = host
	} else {
		webConfig.Host = model.DefaultHost
	}

	if certFile, ok := os.LookupEnv(model.EnvCertFileKey); ok {
		webConfig.CertFile = certFile
	} else {
		webConfig.CertFile = ""
	}

	if keyFile, ok := os.LookupEnv(model.EnvKeyFileKey); ok {
		webConfig.KeyFile = keyFile
	} else {
		webConfig.KeyFile = ""
	}

	if db, ok := os.LookupEnv(model.EnvDBKey); ok {
		dbConnectionString = db
	}

	if cache, ok := os.LookupEnv(model.EnvCacheKey); ok {
		cacheConnectionString = cache
	}

	if fixer, ok := os.LookupEnv(model.EnvFixerKey); ok {
		servicesConfig.FixerKey = fixer
	}

	if currLayerKey, ok := os.LookupEnv(model.EnvCurrencyLayerKey); ok {
		servicesConfig.CurrencyLayerKey = currLayerKey
	}

	if coinLayerKey, ok := os.LookupEnv(model.EnvCoinLayerKey); ok {
		servicesConfig.CoinLayerKey = coinLayerKey
	}
}

// readConfig Read the program's configuration and, if necessary, print help messages before exiting.
func readConfig() {

	// Print welcome message
	fmt.Printf("Bravo Currency Converter Server v%s\n\n", dao.Version)

	// Parse command line parameters or use system environment values read in init function
	flag.IntVar(&webConfig.Port, "port", webConfig.Port, fmt.Sprintf("port number to bind the server, can be provided also by the environmental variable %s (0-65535)", model.EnvPortKey))
	flag.StringVar(&webConfig.Host, "host", webConfig.Host, fmt.Sprintf("host name to bind the server, can be provided also by the environmental variable %s (localhost)", model.EnvHostKey))
	flag.StringVar(&webConfig.CertFile, "cert", webConfig.CertFile, fmt.Sprintf("path to TLS certificate file, can be provided also by the environmental variable %s (.pem)", model.EnvCertFileKey))
	flag.StringVar(&webConfig.KeyFile, "key", webConfig.KeyFile, fmt.Sprintf("path to TLS certificate key file, can be provided also by the environmental variable %s (.key)", model.EnvKeyFileKey))
	flag.StringVar(&dbConnectionString, "db", dbConnectionString, fmt.Sprintf("Database connection string (Postgres),can be provided also by the environmental variable %s", model.EnvDBKey))
	flag.StringVar(&cacheConnectionString, "cache", cacheConnectionString, fmt.Sprintf("CacheContainer connection string (Redis),can be provided also by the environmental variable %s", model.EnvCacheKey))
	flag.StringVar(&servicesConfig.FixerKey, "fixer", servicesConfig.FixerKey, fmt.Sprintf("fixer currency quote API key,can be provided also by the environmental variable %s", model.EnvFixerKey))
	flag.StringVar(&servicesConfig.CurrencyLayerKey, "currency-layer", servicesConfig.CurrencyLayerKey, fmt.Sprintf("Currency layer currency quote API key, can be provided also by the environmental variable %s", model.EnvCurrencyLayerKey))
	flag.StringVar(&servicesConfig.CoinLayerKey, "coin-layer", servicesConfig.CoinLayerKey, fmt.Sprintf("Coin layer crypto currency quote API key,can be provided also by the environmental variable %s", model.EnvCoinLayerKey))
	help := flag.Bool("help", false, "print this help message")
	flag.Usage = func() {
		execName := strings.Split(os.Args[0], string(os.PathSeparator))
		_, _ = fmt.Fprintf(flag.CommandLine.Output(), "\nusage: %s\n\n", execName[len(execName)-1])
		flag.PrintDefaults()
	}
	flag.Parse()

	// validate the value of the arguments and print a help message
	if (*help) || webConfig.Port < 0 || webConfig.Port > 0xffff || len(webConfig.Host) == 0 ||
		len(dbConnectionString) == 0 || len(cacheConnectionString) == 0 ||
		len(servicesConfig.CoinLayerKey) == 0 ||
		(len(servicesConfig.FixerKey) == 0 && len(servicesConfig.CurrencyLayerKey) == 0) {
		exitCode := 0

		if webConfig.Port < 0 || webConfig.Port > 0xffff {
			fmt.Printf("Invalid port number: %d. The port number must be between 0 and 65535.\n", webConfig.Port)
			exitCode = 1
		}
		if len(webConfig.Host) == 0 {
			fmt.Println("Missing hostname")
			exitCode = 1
		}
		if len(dbConnectionString) == 0 {
			fmt.Println("Missing database connection string")
			exitCode = 1
		}
		if len(cacheConnectionString) == 0 {
			fmt.Println("Missing cache connection string")
			exitCode = 1
		}
		if len(servicesConfig.CoinLayerKey) == 0 {
			fmt.Println("Missing Coin Layer API Key")
			exitCode = 1
		}
		if len(servicesConfig.FixerKey) == 0 && len(servicesConfig.CurrencyLayerKey) == 0 {
			fmt.Println("Missing fixer or Currency Layer API Key")
			exitCode = 1
		}

		flag.Usage()
		os.Exit(exitCode)
	}
}
