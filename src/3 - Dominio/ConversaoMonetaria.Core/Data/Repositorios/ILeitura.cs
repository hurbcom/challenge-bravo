using System.Linq;
using ConversaoMonetaria.Dominio.Core.Entidades;

namespace ConversaoMonetaria.Dominio.Core.Data.Repositorios;

public interface ILeitura<T> where T : Entidade
{
    IQueryable<T> Listar();

    IQueryable<T> Obter(long id);
}