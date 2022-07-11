using System.Threading.Tasks;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Aplicacao.Interfaces.AntiCorruption;

public interface IAwesomeApiAppService
{
    Task<Retorno<BussinessException, bool>> AtualizarCotacoes();
}