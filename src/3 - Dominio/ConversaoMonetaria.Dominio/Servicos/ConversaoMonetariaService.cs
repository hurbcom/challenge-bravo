using System.Collections;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using ConversaoMonetaria.Dominio.Interfaces.Servicos;

namespace ConversaoMonetaria.Dominio.Servicos;

public class ConversaoMonetariaService : IConversaoMonetariaService
{
    private Hashtable _cotatacoesAtuais { get; set; }

    public ConversaoMonetariaService()
    {
        _cotatacoesAtuais = new Hashtable();
    }

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

        // Valore recido é dividido pela cotação da moeda origem convertendo assim para Dollar a moeda base,
        // após é dividida pela cotação a moeda destino baseada em dolar.
        return valor/(decimal) moedaDe/(decimal) moedaPara;
    }

}