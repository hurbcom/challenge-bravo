using ConversaoMonetaria.Dominio.Core.Entidades;
using ConversaoMonetaria.Dominio.Enums;
using FluentValidation.Results;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas;

public class Moeda : Entidade
{
    // EF
    public Moeda()
    {
    }

    protected Moeda(string nome, string codigo, decimal cotacao)
    {
        Nome = nome;
        Codigo = codigo;
        Cotacao = cotacao;
    }

    /// <summary>
    ///     Nome da moeda
    /// </summary>
    public string Nome { get; set; }

    /// <summary>
    ///     Codigo da moeda
    /// </summary>
    public string Codigo { get; set; }

    /// <summary>
    ///     Cotacao da moeda em Real
    /// </summary>
    public decimal Cotacao { get; set; }

    /// <summary>
    ///     Status da moeda
    ///     1 - Ativa
    ///     2 - Inativada
    /// </summary>
    public EStatusMoeda Status { get; set; }

    public virtual bool EhAtiva()
    {
        return Status == EStatusMoeda.Ativa;
    }

    public ValidationResult Validar()
    {
        return new MoedaValidador().Validate(this);
    }

    public ValidationResult Excluir()
    {
        var retornoValidacao = new MoedaValidadorExclusao().Validate(this);

        if (retornoValidacao.IsValid)
            Status = EStatusMoeda.Inativada;

        return retornoValidacao;
    }
}