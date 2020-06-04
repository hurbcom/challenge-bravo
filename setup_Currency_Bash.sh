#!/usr/bin/env bash
echo "--- Script de preparacao para Currency Converter api em container ---"
echo " Testando docker presente..."
docker version
echo " Removendo containers previamente subidos"
docker-compose down
echo " Fazendo build dos novos containers"
docker-compose build
echo " Subindo novos containers"
docker-compose up -d
echo " Containers estao no docker, verificando imagens"
docker-compose images
docker-compose ps
echo " Aguardando 30 segundos para iniciar API (banco subindo primeiro)"
sleep 10
echo " 20 segundos faltando..."
sleep 10
echo " 10 segundos faltando..."
sleep 10
docker-compose up -d
echo " --- Script concluido ---"
echo "Endereco da API: http://localhost:8090/diagnostics"
echo "Conectar aos logs: docker logs -f CurrencyConverter"