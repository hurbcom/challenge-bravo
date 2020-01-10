package currency

import (
	"challenge-bravo/server/db"
	"challenge-bravo/utils"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

//Remove deletes a currency from database
func Remove(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	id := params["id"]

	if id == "" {
		utils.HTTPResponse(w, http.StatusInternalServerError, "Bad Request, id is missing.", false)
		return
	}

	result, err := db.Connection.Exec(utils.BuildString("DELETE FROM moedas WHERE id = ", id))
	if err != nil {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while removing data, please try again.", false)
		return
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while removing data, please try again.", false)
		return
	}

	utils.HTTPResponse(w, http.StatusOK, "Currency removed successfully!", false)
}

//RemoveByCode deletes a currency from database by Code
func RemoveByCode(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	code := params["code"]

	if code == "" {
		utils.HTTPResponse(w, http.StatusInternalServerError, "Bad Request, code is missing.", false)
		return
	}

	result, err := db.Connection.Exec(utils.BuildString("DELETE FROM moedas WHERE code = '", code, "'"))
	if err != nil {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while removing data, please try again.", false)
		return
	}

	if rows, _ := result.RowsAffected(); rows == 0 {
		log.Println(err.Error())
		utils.HTTPResponse(w, http.StatusInternalServerError, "Error ocurred while removing data, please try again.", false)
		return
	}

	utils.HTTPResponse(w, http.StatusOK, "Currency removed successfully!", false)
}
