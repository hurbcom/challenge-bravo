package worker

import (
	"curapi/logger"
	"curapi/rates"
	"curapi/util"
	"fmt"

	"github.com/robfig/cron"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log

// StartWorkerManager :: Function responsible to Manage and start scheduled jobs
func StartWorkerManager(timeout int) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	log.Info("• Initializing Worker manager..")

	// Configure cron jobs to periodicaly fetch forex data
	c := cron.New()
	c.AddFunc(fmt.Sprintf("@every %vm", timeout), func() { rates.UpdateRates() })
	c.Start()
	log.Info("• Worker manager started sucessfully.")
}
