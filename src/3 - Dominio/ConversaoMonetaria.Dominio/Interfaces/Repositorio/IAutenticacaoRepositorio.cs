using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Dominio.Interfaces.Repositorio;

public interface IAutenticacaoRepositorio
{
    Retorno<BussinessException, Entidades.Autenticacao.Autenticacao> Autenticar(
        Entidades.Autenticacao.Autenticacao autenticacao);
}