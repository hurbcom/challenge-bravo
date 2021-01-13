package main

import (
	"challenge-bravo-1/api/app"
	"context"
	"os"
	"os/signal"

	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli"
)

func main() {
	log.SetFormatter(&log.JSONFormatter{})
	cliApp := cli.NewApp()
	cliApp.Name = "Bravo"
	cliApp.Description = "Challenge Bravo by Vinicius Cardozo"
	cliApp.Version = "1.0"
	cliApp.EnableBashCompletion = true
	cliApp.Commands = []cli.Command{
		{
			Name:    "run application",
			Aliases: []string{"run"},
			Action: func(cli *cli.Context) error {
				return runApplication()
			},
		},
	}
	err := cliApp.Run(os.Args)
	if err != nil {
		log.WithField("error", err.Error()).Errorf("error on running application")
	}
}

func runApplication() error {
	ctx := gracefullyShutdown()
	application, err := app.LoadApp()
	if err != nil {
		return err
	}
	log.Infof("application running")
	chErr := application.Run()
	select {
	case err := <-chErr:
		if err != nil {
			log.WithField("error", err.Error()).Errorf("something went wrong on the application")
			application.Close()
			return err
		}
	case <-ctx.Done():
		application.Close()
	}
	log.Infof("application closed")
	return nil
}

func gracefullyShutdown() context.Context {
	ctx, cancel := context.WithCancel(context.Background())
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	go func() {
		<-quit
		log.Println("gracefully shutdown")
		cancel()
	}()
	return ctx
}
