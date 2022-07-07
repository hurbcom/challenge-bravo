using System;
using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using ConversaoMonetaria.Dominio.Core.Retornos.RetornosPadrao;
using ConversaoMonetaria.Dominio.Enums;

namespace ConversaoMonetaria.Aplicacao.ViewModels.Moeda;

public class MoedaRespostaViewModel : IViewModel
{
    public ResultadoSucessoPadraoViewModel Resultado { get; set; } = new();

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