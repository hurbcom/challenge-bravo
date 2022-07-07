using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;

namespace ConversaoMonetaria.Dominio.Exceptions.Autenticacao;

public class AutenticacaoJaRealizadaException : BussinessException
{
    public AutenticacaoJaRealizadaException()
        : base(ErrorCodes.Forbidden, Mensagens.Mensagens.AutenticacaoNaoPermitida().CodigoMensagem,
            Mensagens.Mensagens.AutenticacaoNaoPermitida().Mensagem)
    {
    }
}