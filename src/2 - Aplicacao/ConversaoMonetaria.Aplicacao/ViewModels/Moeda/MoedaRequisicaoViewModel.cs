using ConversaoMonetaria.Aplicacao.ViewModels.Base;
using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Mensagens;
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
    ///     Cotacao da moeda em Real
    /// </summary>
    public decimal Cotacao { get; set; }

    public ValidationResult ValidarRequisicao()
    {
        return new MoedaRequisicaoViewModelValidador().Validate(this);
    }

    public class MoedaRequisicaoViewModelValidador : AbstractValidator<MoedaRequisicaoViewModel>
    {
        public MoedaRequisicaoViewModelValidador()
        {
            RuleFor(p => p.Codigo)
                .NotEmpty()
                .WithMessage(
                    Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
                .WithErrorCode(Mensagens.Obrigatorio().CodigoMensagem.ToString());


        RuleFor(p => p.Nome)
            .NotEmpty()
            .WithMessage(Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Obrigatorio().CodigoMensagem.ToString());

        RuleFor(p => p.Cotacao)
            .NotEmpty()
            .WithMessage(Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Obrigatorio().CodigoMensagem.ToString());

        }
    }
}