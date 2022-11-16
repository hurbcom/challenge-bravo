package routes

import "net/http"

type SyncController interface {
	InsertCurrency(http.ResponseWriter, *http.Request)
	DeleteCurrency(http.ResponseWriter, *http.Request)
}

type SyncRoutes struct {
	controller SyncController
}

func NewSyncRoutes(controller SyncController) *SyncRoutes {
	return &SyncRoutes{controller}
}

var syncRoutes = []Route{
	{
		URI:    "/currencies",
		Method: http.MethodPost,
	},
	{
		URI:    "/currencies/{name}",
		Method: http.MethodDelete,
	},
}

func GenerateSyncRoutes(controller SyncController) {
	newSyncRoutes := NewSyncRoutes(controller)

	syncRoutes[0].Function = newSyncRoutes.controller.InsertCurrency
	syncRoutes[1].Function = newSyncRoutes.controller.DeleteCurrency

}
