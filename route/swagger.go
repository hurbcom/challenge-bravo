package route

import (
	"net/http"

	"github.com/CharlesSchiavinato/hurbcom-challenge-bravo/router"
	"github.com/go-openapi/runtime/middleware"
)

func SwaggerRoute(appRouter router.Router) {
	swaggerRedocOpts := middleware.RedocOpts{SpecURL: "swagger.yaml"}
	swaggerRedoc := middleware.Redoc(swaggerRedocOpts, nil)

	appRouter.Get("/docs", swaggerRedoc.ServeHTTP)
	appRouter.Get("/swagger.yaml", http.FileServer(http.Dir("./")).ServeHTTP)
}
