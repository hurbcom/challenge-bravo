using DesafioBravoBackEnd.Models;
using DesafioBravoBackEnd.ViewModels;
using System.Collections.Generic;

namespace DesafioBravoBackEnd.Data
{
    public interface IMoedaDAO
    {
        Moeda Adicionar(AppDbContext context, MoedaViewModel model);
        Moeda Buscar(AppDbContext context, string codigo);
        List<Moeda> BuscarTodas(AppDbContext context);
        void Remover(AppDbContext context, string codigo);
    }
}