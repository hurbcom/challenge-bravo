package log

import (
	"os"

	"github.com/sirupsen/logrus"
)

//Init configures the log
func Init() {
	logrus.SetFormatter(utcFormatter{&logrus.JSONFormatter{}})
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.InfoLevel)
}

func Error(message, module string) {
	logrus.WithFields(logrus.Fields{
		"module": module,
	}).Error(message)
}

func Info(message, module string) {
	logrus.WithFields(logrus.Fields{
		"module": module,
	}).Info(message)
}

func Fatal(message, module string) {
	logrus.WithFields(logrus.Fields{
		"module": module,
	}).Fatal(message)
}

//Time formatter helper
type utcFormatter struct {
	logrus.Formatter
}

func (u utcFormatter) format(e *logrus.Entry) ([]byte, error) {
	e.Time = e.Time.UTC()
	return u.Formatter.Format(e)
}
