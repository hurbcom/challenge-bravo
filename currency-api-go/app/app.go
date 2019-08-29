package app

import (
	"fmt"
	"log"
	"net/http"
	"github.com/challenge-bravo/currency-api-go/app/handler"
	"github.com/challenge-bravo/currency-api-go/app/model"
	//"github.com/challenge-bravo/currency-api-go/app/config"
	//log2 "gopkg.in/inconshreveable/log15.v2"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

// App initialize with predefined configuration
//func (a *App) Initialize(config *config.Config) {
func (a *App) Initialize() {
	dbURI := fmt.Sprintf("%s:%s@/%s?charset=%s&parseTime=True",
		"root",
		"elton56261",
		"currency",
		"utf8")

	db, err := gorm.Open("mysql", dbURI)
	if err != nil {
		log.Print(dbURI)
		log.Fatal("Could not connect database %s")
	}

	a.DB = model.DBMigrate(db)
	a.Router = mux.NewRouter()
	a.setRouters()
}

// Set all required routers
func (a *App) setRouters() {
	// Routing for handling the projects
	a.Get("/currencys", a.GetAllCurrencys)
	a.Post("/currencys", a.CreateCurrency)
	a.Get("/currencys/{title}", a.GetCurrency)
	a.Get("/convert/", a.GetConvertion)
	a.Put("/currencys/{title}", a.UpdateCurrency)
}

// Wrap the router for GET method
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("GET")
}

// Wrap the router for POST method
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("POST")
}

// Wrap the router for PUT method
func (a *App) Put(path string, f func(w http.ResponseWriter, r *http.Request)) {

	a.Router.HandleFunc(path, f).Methods("PUT")
}

// Wrap the router for DELETE method
func (a *App) Delete(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("DELETE")
}

// Handlers to manage Currency Data
func (a *App) GetAllCurrencys(w http.ResponseWriter, r *http.Request) {
	handler.GetAllCurrencys(a.DB, w, r)
}

func (a *App) CreateCurrency(w http.ResponseWriter, r *http.Request) {
	handler.CreateCurrency(a.DB, w, r)
}

func (a *App) GetCurrency(w http.ResponseWriter, r *http.Request) {
	handler.GetCurrency(a.DB, w, r)
}

func (a *App) UpdateCurrency(w http.ResponseWriter, r *http.Request) {
	handler.UpdateCurrency(a.DB, w, r)
}

func (a *App) DeleteCurrency(w http.ResponseWriter, r *http.Request) {
	handler.DeleteCurrency(a.DB, w, r)
}

func (a *App) GetConvertion(w http.ResponseWriter, r *http.Request){
	handler.GetConvertion(a.DB, w, r)

}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}