package main

import (
	"context"
	"github.com/ednailson/challenge-bravo/app"
	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli"
	"os"
	"os/signal"
)

func main() {
	log.SetFormatter(&log.JSONFormatter{})
	cliApp := cli.NewApp()
	cliApp.Name = ApplicationName
	cliApp.Description = "Challenge for HURB by Ednailson Junior"
	cliApp.Version = Version
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
		log.WithFields(log.Fields{"error": err.Error()}).Errorf("error on running application")
	}
}

func runApplication() error {
	ctx := gracefullyShutdown()
	application, err := app.LoadApp()
	if err != nil {
		return err
	}
	log.Infof("running application")
	chErr := application.Run()
	select {
	case err := <-chErr:
		if err != nil {
			log.WithFields(log.Fields{"error": err.Error()}).Errorf("something went wrong on the application")
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
