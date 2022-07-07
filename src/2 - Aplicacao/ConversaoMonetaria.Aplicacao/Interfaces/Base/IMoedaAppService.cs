using System.Collections.Generic;
using System.Threading.Tasks;
using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Aplicacao.Interfaces.Base;

public interface IBaseAppService<in T, TR> where T : IViewModel where TR : IViewModel
{
    Task<Retorno<BussinessException, List<TR>>> Listar();

    Task<Retorno<BussinessException, TR>> Obter(long id);

    Task<Retorno<BussinessException, TR>> Salvar(T entity);

    Task<Retorno<BussinessException, TR>> Atualizar(T entity);

    Task<Retorno<BussinessException, TR>> Deletar(long id);
}