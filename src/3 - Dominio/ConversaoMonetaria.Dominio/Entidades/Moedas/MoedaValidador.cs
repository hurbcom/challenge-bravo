using System;
using System.Linq;
using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Enums;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas;

public class MoedaValidador : AbstractValidator<Moeda>
{
    public MoedaValidador()
    {
        RuleFor(p => p.Codigo)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .MaximumLength(4)
            .WithMessage(Mensagens.Mensagens.TamanhoMaximo().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 4))
            .WithErrorCode(Mensagens.Mensagens.TamanhoMaximo().CodigoMensagem.ToString())
            .MinimumLength(3)
            .WithMessage(Mensagens.Mensagens.TamanhoMinimo().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 3))
            .WithErrorCode(Mensagens.Mensagens.TamanhoMinimo().CodigoMensagem.ToString())
            .Must(EhCaixaAlta).WithMessage(Mensagens.Mensagens.CaixaAlta().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.CaixaAlta().CodigoMensagem.ToString());

        RuleFor(p => p.Nome)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .MaximumLength(150)
            .WithMessage(Mensagens.Mensagens.TamanhoMaximo().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 150))
            .WithErrorCode(Mensagens.Mensagens.TamanhoMaximo().CodigoMensagem.ToString())
            .MinimumLength(5)
            .WithMessage(Mensagens.Mensagens.TamanhoMinimo().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 5))
            .WithErrorCode(Mensagens.Mensagens.TamanhoMinimo().CodigoMensagem.ToString());

        RuleFor(p => p.Cotacao)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .GreaterThan(0)
            .WithMessage(Mensagens.Mensagens.MaiorQue().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 0))
            .WithErrorCode(Mensagens.Mensagens.MaiorQue().CodigoMensagem.ToString());

        RuleFor(p => p.Status)
            .Must(ValidarStatus)
            .WithMessage(Mensagens.Mensagens.OpcaoInvalida().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.OpcaoInvalida().CodigoMensagem.ToString());
    }

    private static bool ValidarStatus(EStatusMoeda statusMoeda)
    {
        return Enum.IsDefined(typeof(EStatusMoeda), statusMoeda);
    }

    public bool EhCaixaAlta(string literal)
    {
        return literal.All(char.IsUpper);
    }
}