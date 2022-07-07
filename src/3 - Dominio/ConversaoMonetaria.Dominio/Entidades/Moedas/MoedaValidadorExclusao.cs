using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using ConversaoMonetaria.Dominio.Enums;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas;

public class MoedaValidadorExclusao : AbstractValidator<Moeda>
{
    public MoedaValidadorExclusao()
    {
        RuleFor(s => s.Status)
            .Equal(EStatusMoeda.Ativa)
            .WithMessage(Mensagens.Mensagens.DiferenteDe().Mensagem.FormatEx(ConstantesString.PropertyNameValidated, 1))
            .WithErrorCode(Mensagens.Mensagens.DiferenteDe().CodigoMensagem.ToString());
    }
}



