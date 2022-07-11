using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Retornos;

namespace ConversaoMonetaria.Aplicacao.Interfaces;

public interface IAutenticacaoAppService
{
    Retorno<BussinessException, AutenticacaoRespostaViewModel> Autenticar(AutenticacaoViewModel model);
}