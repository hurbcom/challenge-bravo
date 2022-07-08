using System;
using System.Collections.Generic;
using ConversaoMonetaria.Dominio.Entidades.Moedas;
using ConversaoMonetaria.Dominio.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConversaoMonetaria.Data.Seeds;

public static class MoedaSeed
{
    public static void GerarMoedaSeed(this ModelBuilder modelBuilder)
    {
        var moedas = new List<Moeda>
        {
            new()
            {
                Id = 1,
                Codigo = "BRL",
                Nome = "Real Brasileiro",
                Cotacao = 1m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 2,
                Codigo = "USD",
                Nome = "Dólar Americano",
                Cotacao = 5.3407m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 3,
                Codigo = "CAD",
                Nome = "Dólar Canadense",
                Cotacao = 4.1108m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 4,
                Codigo = "GBP",
                Nome = "Libra Esterlina",
                Cotacao = 6.4083m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 5,
                Codigo = "ARS",
                Nome = "Peso Argentino",
                Cotacao = 0.0422m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 6,
                Codigo = "BTC",
                Nome = "Bitcoin",
                Cotacao = 115.668m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            },

            new()
            {
                Id = 7,
                Codigo = "EUR",
                Nome = "Euro",
                Cotacao = 5.4235m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = null,
                DataCadastro = DateTime.Now
            }
        };

        modelBuilder.Entity<Moeda>().HasData(moedas);
    }
}