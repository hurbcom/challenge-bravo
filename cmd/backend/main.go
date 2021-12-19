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

// Server configuration parameters
var config server.Config

// Database connection string
var dbConnString = ""

// Cache connection string
var cacheConnString = ""

// Constants
const (
	EnvPortKey     = "BRAVO_PORT"      // EnvPortKey Server port number environment variable name
	EnvHostKey     = "BRAVO_HOST"      // EnvHostKey Server host name environment variable name
	EnvCertFileKey = "BRAVO_CERT_FILE" // EnvCertFileKey Server certificate file path environment variable name
	EnvKeyFileKey  = "BRAVO_KEY_FILE"  // EnvKeyFileKey Server certificate key file path environment variable name
	EnvDBKey       = "BRAVO_DB"        // EnvDBKey Database connection string (postgres) environment variable name
	EnvCacheKey    = "BRAVO_CACHE"     // EnvCacheKey Cache connection string (redis) environment variable name

	defaultPort = 8080        // defaultPort Default server port
	defaultHost = "localhost" // defaultHost Default server host
	version     = "1.0.0"     // version Bravo version
)

// main Program entry point
func main() {

	// Read the program's configuration
	readConfig()

	// Initalize data layer
	if err := model.Init(dbConnString, cacheConnString); err != nil {
		os.Exit(1)
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
}

// readConfig Read the program's configuration and, if necessary, print help messages before exiting.
func readConfig() {

	// Print welcome message
	fmt.Printf("Bravo Currency Converter Server v%s\n\n", version)

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

	// Validate the value of the arguments and print a help message
	if (*help) || config.Port < 0 || config.Port > 0xffff || len(config.Host) == 0 ||
		len(dbConnString) == 0 || len(cacheConnString) == 0 {
		exitCode := 0

		if config.Port < 0 || config.Port > 0xffff {
			fmt.Printf("Invalid port number: %d. The port number must be between 0 and 65535.\n", config.Port)
			exitCode = 1
		}
		if len(config.Host) == 0 {
			fmt.Println("Missing hostname")
			exitCode = 1
		}
		if len(dbConnString) == 0 {
			fmt.Println("Missing database connection string")
			exitCode = 1
		}
		if len(cacheConnString) == 0 {
			fmt.Println("Missing cache connection string")
			exitCode = 1
		}
		flag.Usage()
		os.Exit(exitCode)
	}
}
