package config

import "github.com/sirupsen/logrus"

var Config = struct {
	DevelopmentMode bool
	Debug           bool
}{}

func StartConfig(newLogger *logrus.Logger) {
	var log = newLogger.WithFields(logrus.Fields{"method": "StartConfig"})
	if Config.Debug {
		newLogger.SetLevel(logrus.DebugLevel)
	}
	if Config.DevelopmentMode {
		log.Info("• Running Development profile")
	} else {
		log.Info("• Running Production profile")
	}
}
