using System.Collections.Generic;
using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using ConversaoMonetaria.Dominio.Core.Retornos.RetornosPadrao;
using ConversaoMonetaria.Dominio.Enums;

namespace ConversaoMonetaria.Aplicacao.ViewModels.Moeda;

public class MoedaListarRespostaViewModel : IViewModel
{
    public ResultadoSucessoPadraoViewModel Resultado { get; set; } = new();

    public List<MoedasRespostaViewModel> Moedas { get; set; }
}

public class MoedaRespostaViewModel : MoedasRespostaViewModel, IViewModel
{
    public ResultadoSucessoPadraoViewModel Resultado { get; set; } = new();
}

public class MoedasRespostaViewModel
{
    /// <summary>
    ///     Id da moeda
    /// </summary>
    public long Id { get; set; }

    /// <summary>
    ///     Nome da moeda
    /// </summary>
    public string Nome { get; set; }

    /// <summary>
    ///     Codigo da moeda
    /// </summary>
    public string Codigo { get; set; }

    /// <summary>
    ///     Cotacao da moeda em Dolar
    /// </summary>
    public decimal Cotacao { get; set; }

    /// <summary>
    ///     Status da moeda
    ///     1 - Ativa
    ///     2 - Inativada
    /// </summary>
    public EStatusMoeda Status { get; set; }
}