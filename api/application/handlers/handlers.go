package handlers

import (
	"github.com/iiurydias/challenge-bravo/api/application/controller"
	log "github.com/sirupsen/logrus"
)

type handlers struct {
	controller controller.Controller
}

func New(controller controller.Controller) Handlers {
	return &handlers{controller: controller}
}

func logError(err error) {
	if err != nil {
		log.Errorln(err)
	}
}
