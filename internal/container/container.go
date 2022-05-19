package container

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"challenge-bravo/internal/config"
	"challenge-bravo/pkg/core/log"
	"challenge-bravo/pkg/core/telemetry"
	"challenge-bravo/pkg/core/types"
	"challenge-bravo/pkg/domains/currencyconversion/repository"
	"challenge-bravo/pkg/domains/currencyconversion/service"

	_ "github.com/lib/pq"
)

// Components are a like service, but it doesn't include business case
// Or domains, but likely used by multiple domains
type components struct {
	Log    log.Logger
	Tracer telemetry.Tracer
	DB     *sql.DB
}

// Services hold the business case, and make the bridge between
// Controllers and Domains
type Services struct {
	CurrencyConversion service.ServiceI
}

type Dependency struct {
	Components components
	Services   Services
}

func New(ctx context.Context) (context.Context, *Dependency, error) {
	cmp, err := setupComponents(ctx)
	if err != nil {
		return nil, nil, err
	}

	currencyConversionService, err := service.NewService(
		repository.NewRepository(cmp.Log, cmp.DB),
		cmp.Log,
	)

	if err != nil {
		return nil, nil, err
	}

	srv := Services{
		currencyConversionService,
		// include services initialized above here
	}

	dep := Dependency{
		Components: *cmp,
		Services:   srv,
	}

	return ctx, &dep, err
}

func setupComponents(ctx context.Context) (*components, error) {
	version, ok := ctx.Value(types.ContextKey(types.Version)).(*config.Version)
	if !ok {
		return nil, config.ErrVersionTypeAssertion
	}

	l, err := log.NewLoggerZap(log.ZapConfig{
		Version:           version.GitCommitHash,
		DisableStackTrace: true,
	})
	if err != nil {
		return nil, err
	}

	var (
		databaseDriver   = os.Getenv("DATABASE_DRIVER")
		databaseHost     = os.Getenv("DATABASE_HOST")
		databasePort     = os.Getenv("DATABASE_PORT")
		databaseUser     = os.Getenv("DATABASE_USER")
		databasePassword = os.Getenv("DATABASE_PASSWORD")
		databaseName     = os.Getenv("DATABASE_NAME")
		dataSource       = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", databaseHost, databasePort, databaseUser, databasePassword, databaseName)
	)

	db, err := sql.Open(databaseDriver, dataSource)
	if err != nil {
		return nil, err
	}

	return &components{
		Log: l,
		DB:  db,
	}, nil
}
