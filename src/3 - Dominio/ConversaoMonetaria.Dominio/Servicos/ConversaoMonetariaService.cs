using System.Collections;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using ConversaoMonetaria.Dominio.Interfaces.Servicos;

namespace ConversaoMonetaria.Dominio.Servicos;

public sealed class ConversaoMonetariaSingleton
{
    private ConversaoMonetariaSingleton()
    {
    }

    public static ConversaoMonetariaService Instance { get; } = new();
}

public class ConversaoMonetariaService : IConversaoMonetariaService
{
    public ConversaoMonetariaService()
    {
        _cotatacoesAtuais = new Hashtable();
    }

    private Hashtable _cotatacoesAtuais { get; }

    public void AdicionarCotacao(string codigoMoeda, decimal cotacao)
    {
        _cotatacoesAtuais[codigoMoeda] = cotacao;
    }

    public Retorno<BussinessException, decimal> Converter(string codigoMoedaDe, string codigoMoedaPara, decimal valor)
    {
        var moedaDe = _cotatacoesAtuais[codigoMoedaDe];
        var moedaPara = _cotatacoesAtuais[codigoMoedaPara];

        if (moedaDe is null || moedaPara is null)
            return new NaoEncontradoException();

        // Valore recido é dividido pela cotação da moeda origem convertendo assim para Real a moeda base,
        // após é dividida pela cotação a moeda destino baseada em Real.
        return valor * (decimal) moedaDe / (decimal) moedaPara;
    }
}