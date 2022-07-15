package staticfiles

import "embed"

// Docs emebds all the docs files
//go:embed docs/*
var Docs embed.FS
