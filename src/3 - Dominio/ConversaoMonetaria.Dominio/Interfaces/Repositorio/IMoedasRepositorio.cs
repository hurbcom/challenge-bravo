using ConversaoMonetaria.Dominio.Core.Data.Repositorios;
using ConversaoMonetaria.Dominio.Entidades.Moedas;

namespace ConversaoMonetaria.Dominio.Interfaces.Repositorio;

public interface IMoedaRepositorio : IGravacao<Moeda>, ILeitura<Moeda>
{
}