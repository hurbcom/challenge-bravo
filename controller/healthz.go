package controller

import (
	"encoding/json"
	"net/http"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/model"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/cache"
	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/database/repository"
	logger "github.com/CharlesSchiavinato/hurbcom-challenge-bravo/service/logger"
	"github.com/hashicorp/go-hclog"
)

type Healthz struct {
	Log        hclog.Logger
	Repository repository.Repository
	Cache      cache.Cache
}

func NewHealthz(log hclog.Logger, repository repository.Repository, cache cache.Cache) *Healthz {
	return &Healthz{
		Log:        log,
		Repository: repository,
		Cache:      cache,
	}
}

func (controllerHealthz *Healthz) Check(rw http.ResponseWriter, req *http.Request) {
	const handlerLogTitle = "Health Check"
	err := controllerHealthz.Repository.Check()

	healthzModel := &model.Healthz{}

	if err != nil {
		logger.LogErrorRequest(controllerHealthz.Log, req, handlerLogTitle, err)
		rw.WriteHeader(http.StatusFailedDependency)
		healthzModel.Database = err.Error()
	} else {
		healthzModel.Database = "OK"
	}

	err = controllerHealthz.Cache.Check()

	if err != nil {
		logger.LogErrorRequest(controllerHealthz.Log, req, handlerLogTitle, err)
		rw.WriteHeader(http.StatusFailedDependency)
		healthzModel.Cache = err.Error()
	} else {
		healthzModel.Cache = "OK"
	}

	json.NewEncoder(rw).Encode(healthzModel)
}
