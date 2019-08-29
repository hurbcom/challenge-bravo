package app
 
import (
	"log"
	"net/http"
	"github.com/challenge-bravo/currency-api-go/app/routers"

	"github.com/gorilla/mux"
)

var Router *mux.Router


func Initialize() {
	Router = mux.NewRouter()
	routers.SetRouters(Router)
}

func Run(host string) {
	log.Fatal(http.ListenAndServe(host, Router))
}