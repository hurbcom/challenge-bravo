using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Logging;

namespace ConversaoMonetaria.Dominio.Exceptions.Base;

public class NaoEncontradoException : BussinessException
{
    public NaoEncontradoException()
        : base(ErrorCodes.NotFound, Mensagens.Mensagens.NaoEncontrado().CodigoMensagem,
            Mensagens.Mensagens.NaoEncontrado().Mensagem)
    {
        try
        {
            LoggingCommand.LogErro("ConversaoMonetariaAPI", Mensagens.Mensagens.NaoEncontrado().Mensagem, "API");
        }
        catch (Exception)
        {
            // ignored
        }
    }
}