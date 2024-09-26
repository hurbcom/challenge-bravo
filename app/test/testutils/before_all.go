package testutils

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/config"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/enum"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/app/internal/route"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
	testcontainer "github.com/wesleyfebarretos/challenge-bravo/pkg/test_container"
)

var (
	runningContainers = []*testcontainer.ContainerResult{}
	server            = &httptest.Server{}
	client            = &http.Client{}
)

func BeforeAll() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("error trying to find working dir: %v", err)
	}

	if err := godotenv.Load(fmt.Sprintf("%s/.env.test", wd)); err != nil {
		log.Fatal(err)
	}

	config.Init()

	// Moving default logger output to Stderr which is closed to not spam the tests
	config.Envs.Log.Output = os.Stderr

	wg := &sync.WaitGroup{}

	var pgContainer *testcontainer.ContainerResult
	var redisContainer *testcontainer.ContainerResult

	runInParallel(wg, func() {
		pgContainer = testcontainer.SetupPG(testcontainer.PgConfig{
			Image:    "postgres:13-alpine",
			Database: config.Envs.DB.Name,
			User:     config.Envs.DB.User,
			Password: config.Envs.DB.Password,
		})
		runningContainers = append(runningContainers, pgContainer)
	})
	runInParallel(wg, func() {
		redisContainer = testcontainer.SetupRedis()
		runningContainers = append(runningContainers, redisContainer)
	})

	wg.Wait()

	config.Envs.DB.Host = pgContainer.Host
	config.Envs.DB.Port = fmt.Sprintf("%d", pgContainer.Port)
	config.Envs.Redis.Port = fmt.Sprintf("%d", redisContainer.Port)
	config.Envs.Redis.HostAndPort = fmt.Sprintf("%s:%d", redisContainer.Host, redisContainer.Port)

	if _, err := db.Init(); err != nil {
		log.Fatal(err)
	}
	if err = db.RunMigrations(context.TODO()); err != nil {
		log.Fatalf("setup migrations error %v", err)
	}

	if err := aredis.Init(config.Envs.Redis.HostAndPort, config.Envs.Redis.Password); err != nil {
		log.Fatal(err)
	}

	// Set application to test enviroment
	config.Envs.AppEnv = enum.TEST_ENVIROMENT

	server = httptest.NewServer(route.Init())
}
