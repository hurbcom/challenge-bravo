using ConversaoMonetaria.Aplicacao.Interfaces.Base;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;

namespace ConversaoMonetaria.Aplicacao.Interfaces;

public interface IMoedaAppService : IBaseAppService<MoedaRequisicaoViewModel, MoedaRespostaViewModel>
{
}