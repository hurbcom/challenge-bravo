using DesafioBravoBackEnd.Models;
using DesafioBravoBackEnd.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace DesafioBravoBackEnd.Data
{
    public class MoedaDAO : IMoedaDAO
    {
        public Moeda Buscar(AppDbContext context, string codigo)
        {
            var moeda = context
                .Moedas
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Codigo == codigo);

            return moeda.Result;
        }

        public Moeda Adicionar(AppDbContext context, MoedaViewModel model)
        {
            var moeda = new Moeda
            {
                Codigo = model.Codigo,
                Data = DateTime.Now,
                ValorEmDolar = model.ValorEmDolar
            };

            try
            {
                context.Moedas.AddAsync(moeda);
                context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                new Exception(ex.Message);
                return null;
            }

            return moeda;

        }

        public List<Moeda> BuscarTodas(AppDbContext context)
        {
            return context
               .Moedas
               .AsNoTracking()
               .ToListAsync()
               .Result;
        }

        public void Remover(AppDbContext context, string codigo)
        {
            var moeda = context.Moedas.FirstOrDefaultAsync(x => x.Codigo == codigo);
            context.Moedas.Remove(moeda.Result);
            context.SaveChangesAsync();
        }
    }
}
