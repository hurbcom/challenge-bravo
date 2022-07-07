using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using FluentValidation;
using FluentValidation.Results;

namespace ConversaoMonetaria.Aplicacao.ViewModels.Moeda;

public class MoedaRequisicaoViewModel : IViewModel
{
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

    public ValidationResult ValidarRequisicao()
    {
        return new MoedaRequisicaoViewModelValidador().Validate(this);
    }

    public class MoedaRequisicaoViewModelValidador : AbstractValidator<MoedaRequisicaoViewModel>
    {
    }
}