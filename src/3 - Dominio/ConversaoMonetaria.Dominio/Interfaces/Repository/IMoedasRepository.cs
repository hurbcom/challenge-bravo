using ConversaoMonetaria.Dominio.Core.Data.Repositorios;
using ConversaoMonetaria.Dominio.Entidades.Moedas;

namespace ConversaoMonetaria.Dominio.Interfaces.Repository;

public interface IMoedaRepositorio : IGravacao<Moeda>, ILeitura<Moeda>
{
}