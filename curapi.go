package main

import (
	"context"
	api "curapi/api/server"
	"curapi/config"
	"curapi/logger"
	"curapi/util"
	"os"
	"os/signal"
	"time"

	flags "github.com/jessevdk/go-flags"
	"github.com/sirupsen/logrus"
)

var opts struct {
	Debug       bool `short:"v" long:"verbose" description:"Enable verbose mode (debug)"`
	Port        *int `short:"p" long:"port" description:"Port to listen on" default:"8080"`
	Development bool `short:"d" long:"dev" description:"Enable development environment"`
}

var newLogger = logrus.New()

func main() {
	// Instantiate log handler to log orign method
	var log = newLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	// Handle flags parsing
	var parser = flags.NewParser(&opts, flags.Default)
	if _, err := parser.Parse(); err != nil {
		if flagsErr, ok := err.(*flags.Error); ok && flagsErr.Type == flags.ErrHelp {
			os.Exit(0)
		} else {
			log.Error("• Error:", err.Error())
			os.Exit(1)
		}
	}

	// Parsing and setting debug logging level
	if opts.Debug {
		config.Config.Debug = true
		newLogger.SetLevel(logrus.DebugLevel)
	}

	// Parsing Development mode
	if opts.Development {
		config.Config.DevelopmentMode = true

		// Set Logging level and beauty formatter for development mode
		var pf = logger.TextFormatter{
			TimestampFormat: "Jan 02 2006 15:04:05",
			ForceColors:     true,
			FullTimestamp:   true,
			ForceFormatting: true,
		}
		newLogger.Formatter = &pf
		log.Info("• Development Mode enabled")
	} else {
		// Set JSON formatter for production environment (send to centralized log solution?)
		newLogger.Formatter = &logrus.JSONFormatter{}
	}

	// Initiate config and logger things
	config.StartConfig(newLogger)
	logger.SetupLogger()
	api.StartAPIService(*opts.Port)

	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	log.Info("• Server is shutting down..")
	api.Server.Shutdown(ctx)
	os.Exit(0)
}
