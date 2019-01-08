package cache

import (
	"curapi/logger"
	"curapi/util"
	"time"

	"github.com/allegro/bigcache"
	"github.com/sirupsen/logrus"
)

var getLogger = logger.Log
var Cache *bigcache.BigCache
var err error

// StartCache :: Function responsible to initialize the cache service
func StartCache() {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	log.Info("• Initializing cache...")

	Cache, err = bigcache.NewBigCache(bigcache.DefaultConfig(30 * time.Minute))
	if err != nil {
		log.Error(err)
	}
}

// Get :: Shortcut function to Get value from a key in cache
func Get(key string) (string, error) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	entry, err := Cache.Get(key)
	if err != nil {
		log.Error(err)
	}
	log.Debugf("• Getting key: %s (%s)", key, string(entry))
	return string(entry), err
}

// Set :: Shortcut function to Set value to a key in cache
func Set(key, value string) error {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})
	err := Cache.Set(key, []byte(value))
	if err != nil {
		log.Error(err)
	}
	log.Debugf("• Setting key: %s (%s)", key, value)
	return nil
}
