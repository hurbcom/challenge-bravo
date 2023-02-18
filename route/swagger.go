package route

import (
	"net/http"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/handler"
	"github.com/go-openapi/runtime/middleware"
)

func SwaggerRoute(handlerRouter handler.Router) {
	swaggerRedocOpts := middleware.RedocOpts{SpecURL: "swagger.yaml"}
	swaggerRedoc := middleware.Redoc(swaggerRedocOpts, nil)

	handlerRouter.Get("/docs", swaggerRedoc.ServeHTTP)
	handlerRouter.Get("/swagger.yaml", http.FileServer(http.Dir("./")).ServeHTTP)
}
