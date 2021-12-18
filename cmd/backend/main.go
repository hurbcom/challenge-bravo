package main

import (
	"challenge-bravo/server"
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"
)

const usage = `usage: %s`

const (
	defaultPort = 8080
	defaultHost = "localhost"
)

var config server.Config

func main() {
	flag.IntVar(&config.Port, "port", config.Port, "port to bind the server")
	flag.StringVar(&config.Host, "host", config.Host, "host to bind the server")
	flag.StringVar(&config.CertFile, "cert", config.CertFile, "certificate file")
	flag.StringVar(&config.KeyFile, "key", config.KeyFile, "key file")
	flag.Bool("help", false, "print command help")
	flag.Usage = func() {
		_, _ = fmt.Fprintf(flag.CommandLine.Output(), usage, os.Args[0])
		flag.PrintDefaults()
	}
	flag.Parse()

	if err := server.Start(config); err != nil {
		log.Fatalln(err)
	}

}

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
