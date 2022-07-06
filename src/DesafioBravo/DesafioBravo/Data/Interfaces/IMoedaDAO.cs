using DesafioBravo.Models;
using DesafioBravo.ViewModels;
using System.Collections.Generic;

namespace DesafioBravo.Data
{
    public interface IMoedaDAO
    {
        Moeda Adicionar(AppDbContext context, MoedaViewModel model);
        Moeda Buscar(AppDbContext context, string codigo);
        List<Moeda> BuscarTodas(AppDbContext context);
        void Remover(AppDbContext context, string codigo);
    }
}