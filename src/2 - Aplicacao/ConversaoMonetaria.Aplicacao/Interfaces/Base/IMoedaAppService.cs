using System.Collections.Generic;
using System.Threading.Tasks;
using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Aplicacao.Interfaces.Base;

public interface IBaseAppService<in TVmAdicao, VMRetorno, VMLista>
    where TVmAdicao : IViewModel
    where VMRetorno : IViewModel
    where VMLista : IViewModel
{
    Task<Retorno<BussinessException, VMLista>> Listar();

    Task<Retorno<BussinessException, VMRetorno>> Obter(long id);

    Task<Retorno<BussinessException, VMRetorno>> Salvar(TVmAdicao entity);

    Task<Retorno<BussinessException, VMRetorno>> Atualizar(long id, TVmAdicao entity);

    Task<Retorno<BussinessException, bool>> Deletar(long id);
}