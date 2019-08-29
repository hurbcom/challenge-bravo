package main

import (
	"../app"
	// /"../app/config"
	log "gopkg.in/inconshreveable/log15.v2"
)

func main() {
	//config := config.GetConfig()

	log.Warn("this is a message")
	app := &app.App{}
	app.Initialize()
	app.Run(":3000")
}