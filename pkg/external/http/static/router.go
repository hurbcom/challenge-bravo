package static

import (
	"html/template"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/rakyll/statik/fs"

	_ "github.com/hurbcom/challenge-bravo/pkg/external/http/static/statik"
)

type HTMLData struct {
	RawAPISpec string
}

func NewRouter() (http.Handler, error) {
	staticfs, err := fs.New()
	if err != nil {
		return nil, err
	}

	rawAPISpec, err := fs.ReadFile(staticfs, "/swagger.json")
	if err != nil {
		panic(err)
	}

	htmlStringTemplate := `
<!DOCTYPE html>
<html>
  <head>
    <title>Hurb | Challenge Bravo</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    ReDoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="redoc-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
    <script>
      const spec = JSON.parse({{.RawAPISpec}});
      Redoc.init(spec, {}, document.getElementById('redoc-container'));
    </script>
  </body>
</html>
	`

	htmlTemplate := template.Must(template.New("docs").Parse(htmlStringTemplate))

	router := chi.NewRouter()

	router.Get("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-type", "text/html")

		if err := htmlTemplate.Execute(w, HTMLData{RawAPISpec: string(rawAPISpec)}); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}))

	return router, nil
}
