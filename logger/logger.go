package logger

import (
	"challenge-bravo/config"

	"github.com/sirupsen/logrus"
)

var Log = logrus.New()

func SetupLogger() {
	if config.Config.Debug {
		Log.SetLevel(logrus.DebugLevel)
	}

	if config.Config.DevelopmentMode {
		var pf = TextFormatter{
			TimestampFormat: "Jan 02 2006 15:04:05",
			ForceColors:     true,
			FullTimestamp:   true,
			ForceFormatting: true,
		}
		Log.Formatter = &pf
	} else {
		Log.Formatter = &logrus.JSONFormatter{}
	}
}
