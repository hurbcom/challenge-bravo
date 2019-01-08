package api

import (
	api "curapi/api/handlers"
	"curapi/logger"
	"curapi/util"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

const version = "0.1.0"

var getLogger = logger.Log
var Server *http.Server

// StartAPIService :: Main function to start API service in given port
func StartAPIService(serverPort int) {
	var log = getLogger.WithFields(logrus.Fields{"method": util.GetPrefixName()})

	log.Info("• Starting CurAPI..")
	log.Infof("• Version: v%s", version)

	// Configure router and server routes
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/health", api.HealthCheck).Methods("GET")
	router.HandleFunc("/api/v1/public/convert", api.GetRate).Queries("from", "{from}", "to", "{to}", "amount", "{amount}").Methods("GET", "OPTIONS", "HEAD")
	// router.HandleFunc("/api/v1/public/rates", api.GetAllRates).Methods("GET", "OPTIONS", "HEAD")
	router.Use(api.LoggingMiddleware)

	// Configure CORS (allow all origins, and some methods for now)
	corsOrigins := handlers.AllowedOrigins([]string{"*"})
	corsMethods := handlers.AllowedMethods([]string{"GET", "HEAD", "OPTIONS"})
	log.Infof("• Server running at port: %v", serverPort)

	h := handlers.CORS(corsOrigins, corsMethods)(router)
	s := &http.Server{Addr: "0.0.0.0:" + strconv.Itoa(serverPort), Handler: h, ReadTimeout: 7 * time.Second, WriteTimeout: 7 * time.Second}
	Server = s

	// Run our server in a goroutine so that it doesn't block.
	go func() {
		if err := s.ListenAndServe(); err != nil {
			log.Fatalf("• Error: %s", err.Error())
		}
	}()
}
