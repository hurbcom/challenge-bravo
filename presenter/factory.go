package presenter

import (
	"fmt"
	docs "github.com/VictorNapoles/challenge-bravo/docs"
	"github.com/VictorNapoles/challenge-bravo/infra"
	"github.com/VictorNapoles/challenge-bravo/presenter/controller"
	"github.com/VictorNapoles/challenge-bravo/usecase"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"net/http"
)

var (
	quoteController    *controller.QuoteController
	currencyController *controller.CurrencyController
)

func loadServer() {
	r := gin.Default()
	loadRoutes(r)
	r.Run()
}

func loadRoutes(r *gin.Engine) {
	appUrl, err := infra.GetEnvironment().Get("APP_URL")
	if err != nil {
		panic(err.Error())
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	docs.SwaggerInfo.BasePath = ""

	r.GET("/quote", quoteController.Get)
	currency := r.Group("/currency")
	{
		currency.POST("", currencyController.Save)
		currency.DELETE(fmt.Sprint("/:", controller.CodeParameterKey), currencyController.Delete)
	}

	url := ginSwagger.URL(fmt.Sprint(appUrl, "/swagger/doc.json"))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, url, ginSwagger.DefaultModelsExpandDepth(-1)))
}

func loadQuoteController() {
	quoteController = controller.NewQuoteController(usecase.GetQuoteUsecase())
}
func loadCurrencyController() {
	currencyController = controller.NewCurrencyController(usecase.SaveCurrencyUsecase(), usecase.DeleteCurrencyUsecase())
}

func LoadPresenters() {
	loadQuoteController()
	loadCurrencyController()
	loadServer()
}
