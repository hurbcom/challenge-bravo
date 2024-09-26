package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"runtime"

	"github.com/joho/godotenv"
	_ "github.com/wesleyfebarretos/challenge-bravo/job/docs"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/config"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/infra/db"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/route"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/scheduler"
	"github.com/wesleyfebarretos/challenge-bravo/job/internal/task"
	aredis "github.com/wesleyfebarretos/challenge-bravo/pkg/redis"
)

func init() {
	// Set root dir
	_, filename, _, _ := runtime.Caller(0)
	dir := path.Join(path.Dir(filename), "../")
	os.Chdir(dir)
}

// Swagger entrypoint godoc
//
//	@title						Challenge Bravo Jobs
//
//	@version					1.0
//	@description				Currency Conversion Job API.
//	@termsOfService				http://swagger.io/terms/
//	@contact.name				Wesley Ferreira
//	@contact.url				https://www.linkedin.com/in/wesleyfebarretos/
//	@license.name				Apache 2.0
//	@license.url				http://www.apache.org/licenses/LICENSE-2.0.html
//	@host						localhost:8081
//	@BasePath					/v1
//
//	@securityDefinitions.apikey	Bearer
//	@in							header
//	@name						Authorization
//	@description				Type "Bearer" followed by a space and JWT token.
func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal(err)
	}

	config.Init()

	if err := db.Init(); err != nil {
		log.Fatalf("db connection error %v", err)
	}

	defer db.Conn.Close()

	err := aredis.Init(config.Envs.Redis.HostAndPort, config.Envs.Redis.Password)
	if err != nil {
		log.Fatal(err)
	}

	scheduler := scheduler.New()

	task.NewCurrencyUpdater().AddToScheduler()

	scheduler.Start()

	routes := route.Init()

	if err := routes.Run(fmt.Sprintf(":%s", config.Envs.Port)); err != nil {
		log.Fatalf("Error on starting API: %v", err)
	}
}
