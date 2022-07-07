using ConversaoMonetaria.Dominio.Core.Entidades;
using FluentValidation.Results;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas.Cotacoes;

public class HistoricoCotacoes : Entidade
{
    // EF
    public HistoricoCotacoes()
    {
    }

    protected HistoricoCotacoes(string codigo, decimal cotacao)
    {
        Codigo = codigo;
        Cotacao = cotacao;
    }

    /// <summary>
    ///     Codigo da moeda
    /// </summary>
    public string Codigo { get; set; }

    /// <summary>
    ///     Cotacao da moeda em Dolar
    /// </summary>
    public decimal Cotacao { get; set; }

    public ValidationResult Validar()
    {
        return new HistoricoCotacoesValidador().Validate(this);
    }
}