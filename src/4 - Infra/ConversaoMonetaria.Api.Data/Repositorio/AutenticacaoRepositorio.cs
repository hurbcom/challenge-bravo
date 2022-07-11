using System.Linq;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Entidades.Autenticacao;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;

namespace ConversaoMonetaria.Data.Repositorio;

public class AutenticacaoRepositorio : IAutenticacaoRepositorio
{
    public Retorno<BussinessException, Autenticacao> Autenticar(Autenticacao autenticacao)
    {
        if (!autenticacao.Validar().IsValid)
            return new FormatoInvalidoException(autenticacao.Validar().Errors.FirstOrDefault()?.ErrorCode.ToInt(),
                autenticacao.Validar().Errors.FirstOrDefault()?.ErrorMessage);

        // TODO: Substituir "admin" pelo cadastro de usuários no banco de dados
        if (!autenticacao.Senha.Equals("admin") || !autenticacao.Usuario.Equals("admin"))
            return new NaoAutorizadoException();

        return autenticacao;
    }
}