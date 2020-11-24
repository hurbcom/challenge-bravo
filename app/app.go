package app

type App struct{}

func LoadApp() *App {
	return &App{}
}

func (a *App) Run() chan error {
	return nil
}

func (a *App) Close() {}
