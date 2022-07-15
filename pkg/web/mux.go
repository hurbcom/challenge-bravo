package web

import (
	"io/fs"
	"net"
	"net/http"

	"github.com/Pedro-Pessoa/challenge-bravo/externalapis/abstract"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/cache"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/service/handle"
	"github.com/Pedro-Pessoa/challenge-bravo/pkg/web/service/middleware"
	"github.com/Pedro-Pessoa/challenge-bravo/staticfiles"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/jmoiron/sqlx"
	httpSwagger "github.com/swaggo/http-swagger"
	"go.uber.org/zap"
)

func createMux(db *sqlx.DB, s *cache.Store[string, *abstract.LiveResponse], apiKey, addr string) *chi.Mux {
	r := chi.NewRouter()

	r.Use(chimiddleware.RequestID)
	r.Use(middleware.ChiLogger(zap.L()))
	r.Use(chimiddleware.Recoverer)

	docs, _ := fs.Sub(staticfiles.Docs, "docs")
	r.Handle("/static_docs/*", http.StripPrefix("/static_docs/", http.FileServer(http.FS(docs))))

	_, port, _ := net.SplitHostPort(addr)

	r.Get("/docs/*", httpSwagger.Handler(
		httpSwagger.URL("http://localhost:"+port+"/static_docs/swagger.json"),
		httpSwagger.UIConfig(map[string]string{
			"defaultModelsExpandDepth": "-1",
		}),
	))
	r.Get("/docs", redirectTo("/docs/index.html"))

	r.NotFound(handle.NotFound)

	r.Route("/api", func(r chi.Router) {
		r.Route("/v0", func(r chi.Router) {
			r.Get("/status", handle.Status)

			r.Route("/currencies", func(r chi.Router) {
				r.Post("/", handle.CreateCurrency(db))
				r.Get("/{currency.code}", handle.ReadCurrency(db))
				r.Patch("/{currency.code}", handle.UpdateCurrency(db))
				r.Delete("/{currency.code}", handle.DeleteCurrency(db))

				r.Get("/convert", handle.Convert(db, s, apiKey))
			})
		})
	})

	return r
}

func redirectTo(to string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, to, http.StatusMovedPermanently)
	}
}
