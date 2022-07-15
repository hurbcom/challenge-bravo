package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pedro-Pessoa/challenge-bravo/cmd/env"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/database"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// @title           Challenge Bravo
// @version         0.0.1
// @description     This is the documentation for Pedro Pessoa's solution to HURB's challenge bravo.

// @host      localhost:8080

func main() {
	var (
		useEnvFile        bool
		execDefaultSchema bool
	)
	flag.BoolVar(&useEnvFile, "envfile", false, "set to use the env file instead of getting the config data from env vars")
	flag.BoolVar(&execDefaultSchema, "execds", false, "set to exec the default schema right after connecting to the database")
	flag.Parse()

	startLogger()
	defer func() { _ = zap.L().Sync() }()

	data, err := loadEnv(useEnvFile)
	if err != nil {
		zap.L().Error("failed to load env", zap.Error(err))
		return
	}

	schemas := []string{defaultSchema}
	if !execDefaultSchema {
		schemas = []string{}
	}

	db, err := database.Init(data, schemas)
	if err != nil {
		zap.L().Error("failed to start DB", zap.Error(err))
		return
	}

	ctx, cancel := context.WithCancel(context.Background())
	webmanager, err := web.NewManager(ctx, db, data)
	if err != nil {
		zap.L().Error("failed to create webserver", zap.Error(err))
		return
	}

	startSystem(cancel, webmanager)
}

func startLogger() {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	config.DisableStacktrace = false
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout(time.RFC3339)
	config.ErrorOutputPaths = []string{"stdout"}
	config.OutputPaths = []string{"stdout"}

	logger, err := config.Build()
	if err != nil {
		log.Fatalf("failed to build the logger config, err: %s", err)
	}

	logger = logger.Named("challenge-bravo")
	zap.ReplaceGlobals(logger)
}

func loadEnv(useEnvFile bool) (env.Data, error) {
	var envFileName string
	if useEnvFile {
		envFileName = ".env"
	}

	return env.Load(envFileName)
}

func startSystem(cancel context.CancelFunc, webserver *web.Manager) {
	failChan := make(chan error, 1)
	quit := make(chan os.Signal, 1)

	go func() {
		err := webserver.ListenAndServe(nil)
		if err != nil {
			failChan <- err
		}
	}()

	go func() {
		err := <-failChan
		zap.L().Error("failed start webserver", zap.Error(err))
		quit <- os.Kill
	}()

	signal.Notify(quit, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit

	zap.L().Info("system is shutting down...")
	webserver.Shutdown()
	cancel()
}
