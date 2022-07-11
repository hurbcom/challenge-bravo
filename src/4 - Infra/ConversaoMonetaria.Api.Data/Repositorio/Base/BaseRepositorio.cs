using System.Threading.Tasks;
using ConversaoMonetaria.Data.Context;
using ConversaoMonetaria.Dominio.Core.Data;
using ConversaoMonetaria.Dominio.Core.Entidades;

namespace ConversaoMonetaria.Data.Repositorio.Base;

public abstract class BaseRepositorio<T> where T : Entidade
{
    private readonly ConversaoMonetariaContext _conversaoMonetariaContext;

    public BaseRepositorio(ConversaoMonetariaContext ConversaoMonetariaContext)
    {
        _conversaoMonetariaContext = ConversaoMonetariaContext;
    }

    public IUnitOfWork UnitOfWork => _conversaoMonetariaContext;

    public async Task<int> Deletar(T entity)
    {
        _conversaoMonetariaContext.Remove(entity);
        return await UnitOfWork.Commit();
    }

    public async Task<int> Salvar(T entity)
    {
        await _conversaoMonetariaContext.AddAsync(entity);
        return await UnitOfWork.Commit();
    }

    public async Task<int> Atualizar(T entity)
    {
        _conversaoMonetariaContext.Update(entity);
        return await UnitOfWork.Commit();
    }
}