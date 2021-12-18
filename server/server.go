package server

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

type Config struct {
	Port     int
	Host     string
	CertFile string
	KeyFile  string
}

func Start(config Config) error {

	// Create the server
	app := fiber.New()

	// Create server routes
	createRoutes(app)

	// Start the server
	var err error
	addr := fmt.Sprintf("%s:%d", config.Host, config.Port)
	if len(config.CertFile) > 0 && len(config.KeyFile) > 0 {
		err = app.ListenTLS(addr, config.CertFile, config.KeyFile)
	} else {
		err = app.Listen(addr)
	}
	return err
}
