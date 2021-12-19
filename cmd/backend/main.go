package main

import (
	"challenge-bravo/model"
	"challenge-bravo/server"
	"flag"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Default values
const (
	defaultPort = 8080
	defaultHost = "localhost"
)

// Server configuration parameters
var config server.Config

// Database connection string
var dbConnString = ""

// Cache connection string
var cacheConnString = ""

const (
	EnvPortKey     = "BRAVO_PORT"
	EnvHostKey     = "BRAVO_HOST"
	EnvCertFileKey = "BRAVO_CERT_FILE"
	EnvKeyFileKey  = "BRAVO_KEY_FILE"
	EnvDBKey       = "BRAVO_DB"
	EnvCacheKey    = "BRAVO_CACHE"
)

// main Program entry point
func main() {

	// Print welcome message
	fmt.Print("Bravo Currency Converter Server v.1.0\n\n")

	// Parse command line parameters or use system environment values read in init function
	flag.IntVar(&config.Port, "port", config.Port, fmt.Sprintf("port number to bind the server, can be provided also by the environmental variable %s (0-65535)", EnvPortKey))
	flag.StringVar(&config.Host, "host", config.Host, fmt.Sprintf("host name to bind the server, can be provided also by the environmental variable %s (localhost)", EnvHostKey))
	flag.StringVar(&config.CertFile, "cert", config.CertFile, fmt.Sprintf("path to TLS certificate file, can be provided also by the environmental variable %s (.pem)", EnvCertFileKey))
	flag.StringVar(&config.KeyFile, "key", config.KeyFile, fmt.Sprintf("path to TLS certificate key file, can be provided also by the environmental variable %s (.key)", EnvKeyFileKey))
	flag.StringVar(&dbConnString, "db", dbConnString, fmt.Sprintf("Database connection string (Postgres),can be provided also by the environmental variable %s", EnvDBKey))
	flag.StringVar(&cacheConnString, "cache", cacheConnString, fmt.Sprintf("Cache connection string (Redis),can be provided also by the environmental variable %s", EnvCacheKey))
	help := flag.Bool("help", false, "print this help message")
	flag.Usage = func() {
		execName := strings.Split(os.Args[0], string(os.PathSeparator))
		_, _ = fmt.Fprintf(flag.CommandLine.Output(), "\nusage: %s\n\n", execName[len(execName)-1])
		flag.PrintDefaults()
	}
	flag.Parse()

	// Print the help message
	if *help {
		flag.Usage()
		os.Exit(0)
	}

	// start http server
	server.Start(config)

	// Gracefully terminate data layer
	model.Terminate()
}

// init the application.
// - Read parameters from environment variables, and set as default values (will be overridden by command line parameters)
// - Initalize data layer (database and cache)
func init() {

	// Read parameters from environment variables
	config.Port = defaultPort
	if strPort, ok := os.LookupEnv(EnvPortKey); ok {
		if port, err := strconv.Atoi(strPort); err == nil && port >= 0 && port <= 0xffff {
			config.Port = port
		}
	}

	if host, ok := os.LookupEnv(EnvHostKey); ok {
		config.Host = host
	} else {
		config.Host = defaultHost
	}

	if certFile, ok := os.LookupEnv(EnvCertFileKey); ok {
		config.CertFile = certFile
	} else {
		config.Host = ""
	}

	if keyFile, ok := os.LookupEnv(EnvKeyFileKey); ok {
		config.KeyFile = keyFile
	} else {
		config.KeyFile = ""
	}

	if db, ok := os.LookupEnv(EnvDBKey); ok {
		dbConnString = db
	}

	if cache, ok := os.LookupEnv(EnvCacheKey); ok {
		cacheConnString = cache
	}

	// Initalize data layer
	if err := model.Init(dbConnString, cacheConnString); err != nil {
		os.Exit(1)
	}
}
