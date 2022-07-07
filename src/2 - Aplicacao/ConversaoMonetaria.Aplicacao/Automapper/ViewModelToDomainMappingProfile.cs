using AutoMapper;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;
using ConversaoMonetaria.Dominio.Entidades.Autenticacao;
using ConversaoMonetaria.Dominio.Entidades.Moedas;

namespace ConversaoMonetaria.Aplicacao.Automapper;

public class ViewModelToDomainMappingProfile : Profile
{
    public ViewModelToDomainMappingProfile()
    {
        ConfigureAutenticacaoMap();
        ConfigureMoedaMap();
    }

    private void ConfigureAutenticacaoMap()
    {
        CreateMap<AutenticacaoViewModel, Autenticacao>();
    }

    private void ConfigureMoedaMap()
    {
        CreateMap<MoedaRequisicaoViewModel, Moeda>();
    }
}