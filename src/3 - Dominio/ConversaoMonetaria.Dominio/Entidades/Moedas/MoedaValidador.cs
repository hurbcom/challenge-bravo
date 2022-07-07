using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Enums;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas;

public class MoedaValidador : AbstractValidator<Moeda>
{
    public MoedaValidador()
    {
        // TODO : Fazer

        RuleFor(p => p.Codigo)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString());

        RuleFor(p => p.Nome)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .MaximumLength(150)
            .WithMessage(Mensagens.Mensagens.Tamanho().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 150))
            .WithErrorCode(Mensagens.Mensagens.Tamanho().CodigoMensagem.ToString());

        RuleFor(p => p.Cotacao)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString());

    }

}


