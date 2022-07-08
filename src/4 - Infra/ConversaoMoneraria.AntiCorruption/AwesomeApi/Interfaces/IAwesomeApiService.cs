using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.DTO.AntiCorruption.AwesomeApi;

namespace ConversaoMoneraria.AntiCorruption.AwesomeApi.Interfaces;

public interface IAwesomeApiService
{
    Task<Retorno<BussinessException, AwesomeCotacoes>> BuscarCotacoes();
}