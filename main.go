package main

import (
	"github.com/gabrielerzinger/challenge-bravo/app"
)

func main() {
	application := app.NewApp("0.0.0.0", 9090)
	application.Init()
}
