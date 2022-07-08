using System.Collections.Generic;

namespace ConversaoMonetaria.Dominio.DTO.AntiCorruption.AwesomeApi;

public class AwesomeCotacoes
{
    public AwesomeCotacoes(Dictionary<string, AwesomeRetorno> cotacoes)
    {
        Cotacoes = cotacoes;
    }

    public Dictionary<string, AwesomeRetorno> Cotacoes { get; }
}