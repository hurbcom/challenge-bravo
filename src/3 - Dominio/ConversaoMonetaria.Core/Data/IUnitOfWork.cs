using System.Threading.Tasks;

namespace ConversaoMonetaria.Dominio.Core.Data;

public interface IUnitOfWork
{
    Task<int> Commit();
}