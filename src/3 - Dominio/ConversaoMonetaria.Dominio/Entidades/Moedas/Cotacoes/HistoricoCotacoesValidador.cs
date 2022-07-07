using ConversaoMonetaria.Dominio.Core.Constantes;
using ConversaoMonetaria.Dominio.Core.Utils;
using FluentValidation;

namespace ConversaoMonetaria.Dominio.Entidades.Moedas.Cotacoes;

public class HistoricoCotacoesValidador : AbstractValidator<HistoricoCotacoes>
{
    public HistoricoCotacoesValidador()
    {
        // TODO : Fazer
        RuleFor(p => p.Codigo)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString());

        RuleFor(p => p.Cotacao)
            .NotEmpty()
            .WithMessage(Mensagens.Mensagens.Obrigatorio().Mensagem.FormatEx(ConstantesString.PropertyNameValidated))
            .WithErrorCode(Mensagens.Mensagens.Obrigatorio().CodigoMensagem.ToString());
    }
}