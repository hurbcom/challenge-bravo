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
                Cotacao = 5.4125m,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = DateTime.Now,
                DataCadastro = DateTime.Now,
                TempoParaAtualizacao = TimeSpan.FromSeconds(120)
            },

            new()
            {
                Id = 2,
                Codigo = "USD",
                Nome = "Dólar Americano", Cotacao = 1,
                Status = EStatusMoeda.Ativa,
                DataAtualizacao = DateTime.Now,
                DataCadastro = DateTime.Now,
                TempoParaAtualizacao = TimeSpan.FromSeconds(30)
            }
        };

        modelBuilder.Entity<Moeda>().HasData(moedas);
    }
}