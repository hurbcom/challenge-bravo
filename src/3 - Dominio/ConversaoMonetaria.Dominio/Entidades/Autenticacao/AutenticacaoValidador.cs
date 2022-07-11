using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Entidades.Autenticacao;

public class AutenticacaoValidador : AbstractValidator<Autenticacao>
{
    public AutenticacaoValidador()
    {
        RuleFor(a => a.Senha)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .MaximumLength(100);


        RuleFor(a => a.Usuario)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString())
            .MaximumLength(100)
            .WithMessage(Mensagens.Mensagens.TamanhoMaximo().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 100))
            .WithErrorCode(Mensagens.Mensagens.TamanhoMaximo().CodigoMensagem.ToString());
    }
}