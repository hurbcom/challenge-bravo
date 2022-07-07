using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using FluentValidation;
using FluentValidation.Results;

namespace ConversaoMonetaria.Aplicacao.ViewModels.Moeda;

public class MoedaRequisicaoViewModel : IViewModel
{
    /// <summary>
    ///     Id da empresa
    /// </summary>
    public long IdEmpresa { get; set; }

    public ValidationResult ValidarRequisicao()
    {
        return new MoedaRequisicaoViewModelValidador().Validate(this);
    }

    public class MoedaRequisicaoViewModelValidador : AbstractValidator<MoedaRequisicaoViewModel>
    {
    }
}