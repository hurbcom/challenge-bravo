using System;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Dominio.Interfaces.Servicos;

public interface IConversaoMonetariaService
{
    Retorno<BussinessException, decimal> Converter(string codigoMoedaDe, string codigoMoedaPara, decimal valor);

    void AdicionarCotacao(string codigoMoeda, decimal cotacao);
}