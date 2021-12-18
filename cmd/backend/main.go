package main

import (
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

// main Program entry point
func main() {

	// Print welcome message
	fmt.Print("Bravo Currency Converter Server v.1.0\n\n")

	// Parse command line parameters or use system environment values read in init function
	flag.IntVar(&config.Port, "port", config.Port, "port number to bind the server can be provided also by the environmental variable BRAVO_PORT (0-65535)")
	flag.StringVar(&config.Host, "host", config.Host, "host name to bind the server can be provided also by the environmental variable BRAVO_HOST (localhost)")
	flag.StringVar(&config.CertFile, "cert", config.CertFile, "path to TLS certificate file can be provided also by the environmental variable BRAVO_CERT_FILE (.pem)")
	flag.StringVar(&config.KeyFile, "key", config.KeyFile, "path to TLS certificate key file can be provided also by the environmental variable BRAVO_KEY_FILE (.key)")
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
}

// init the application, read parameters from environment variables.
func init() {

	config.Port = defaultPort
	if strPort, ok := os.LookupEnv("BRAVO_PORT"); ok {
		if port, err := strconv.Atoi(strPort); err == nil && port >= 0 && port <= 0xffff {
			config.Port = port
		}
	}

	if host, ok := os.LookupEnv("BRAVO_HOST"); ok {
		config.Host = host
	} else {
		config.Host = defaultHost
	}

	if certFile, ok := os.LookupEnv("BRAVO_CERT_FILE"); ok {
		config.CertFile = certFile
	} else {
		config.Host = ""
	}

	if keyFile, ok := os.LookupEnv("BRAVO_KEY_FILE"); ok {
		config.KeyFile = keyFile
	} else {
		config.KeyFile = ""
	}

}
