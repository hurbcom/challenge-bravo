package main

var (
	server Server
	routes Routes
)

func main() {
	routes.RegisterAll()
	server.Start()
}
