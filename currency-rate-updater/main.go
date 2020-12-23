package main

import (
	"github.com/iiurydias/challenge-bravo/currency-rate-updater/service"
	"github.com/micro/go-micro/config"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
	"os"
	"os/signal"
)

func main() {
	var flagConfig string
	var flagFileName string
	cliApp := &cli.App{
		Name:  "currency rate updater",
		Usage: "a microservice to pull currency rate from an endpoint and save it on redis",
	}
	cliApp.Commands = []*cli.Command{
		{
			Name:    "config sample generator",
			Aliases: []string{"csg"},
			Action: func(cli *cli.Context) error {
				return configSampleGenerator(flagFileName)
			},
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name:        "file-name, f",
					Value:       "./config.json",
					Usage:       "Config sample file name",
					Destination: &flagFileName,
				},
			},
		},
		{
			Name:    "run service",
			Aliases: []string{"run"},
			Action: func(cli *cli.Context) error {
				return runService(flagConfig)
			},
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name:        "config, c",
					Value:       "./config.json",
					Usage:       "config cliApp file",
					Destination: &flagConfig,
				},
			},
		},
	}
	if err := cliApp.Run(os.Args); err != nil {
		log.Fatalln(err)
	}
}

func runService(fileName string) error {
	var configParams *service.Config
	if err := config.LoadFile(fileName); err != nil {
		return errors.Wrap(err, "failed to load config file")
	}
	if err := config.Scan(&configParams); err != nil {
		return errors.Wrap(err, "failed to scan file")
	}
	log.SetLevel(log.Level(configParams.Log.Level))
	serviceApp, err := service.New(configParams)
	if err != nil {
		return err
	}
	errChan := serviceApp.Run()
	return waitForGracefullyShutdown(serviceApp, errChan)
}

func waitForGracefullyShutdown(serviceApp *service.Service, errChan <-chan error) error {
	interruptServiceChan := make(chan os.Signal)
	signal.Notify(interruptServiceChan, os.Interrupt)
	defer serviceApp.Shutdown()
	select {
	case err := <-errChan:
		return err
	case <-interruptServiceChan:
		log.Warningln("gracefully shutdown")
	}
	return nil
}

func configSampleGenerator(flagFileName string) error {
	return errors.Wrap(service.NewConfigFile(flagFileName), "could not create a new config file")
}
