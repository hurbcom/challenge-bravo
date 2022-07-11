using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Logging;

namespace ConversaoMonetaria.Dominio.Exceptions.Base;

public class NaoAutorizadoException : BussinessException
{
    public NaoAutorizadoException()
        : base(ErrorCodes.Unauthorized, Mensagens.Mensagens.AutenticacaoNaoAutorizada().CodigoMensagem,
            Mensagens.Mensagens.AutenticacaoNaoAutorizada().Mensagem)
    {
        try
        {
            LoggingCommand.LogErro("ConversaoMonetariaAPI", Mensagens.Mensagens.AutenticacaoNaoAutorizada().Mensagem,
                "API");
        }
        catch (Exception)
        {
            // ignored
        }
    }
}