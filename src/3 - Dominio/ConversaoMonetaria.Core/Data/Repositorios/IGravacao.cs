using System.Threading.Tasks;
using ConversaoMonetaria.Dominio.Core.Entidades;

namespace ConversaoMonetaria.Dominio.Core.Data.Repositorios;

public interface IGravacao<T> where T : Entidade
{
    IUnitOfWork UnitOfWork { get; }
    Task<int> Salvar(T entity);
    Task<int> Atualizar(T entity);
    Task<int> Deletar(T entity);
}