using System;
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

    protected Moeda(string nome, string codigo, decimal cotacao, TimeSpan tempoParaAtualizacao)
    {
        Nome = nome;
        Codigo = codigo;
        Cotacao = cotacao;
        TempoParaAtualizacao = tempoParaAtualizacao;
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
    ///     Cotacao da moeda em Dolar
    /// </summary>
    public decimal Cotacao { get; set; }

    /// <summary>
    ///     Status da moeda
    ///     1 - Ativa
    ///     2 - Inativada
    /// </summary>
    public EStatusMoeda Status { get; set; }

    /// <summary>
    ///     Tempo no qual a cotação é valida sem atualização da mesma
    /// </summary>
    public TimeSpan TempoParaAtualizacao { get; set; }

    public ValidationResult Validar()
    {
        return new MoedaValidador().Validate(this);
    }
}