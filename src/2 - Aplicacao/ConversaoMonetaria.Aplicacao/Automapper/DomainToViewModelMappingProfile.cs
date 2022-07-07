using AutoMapper;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;
using ConversaoMonetaria.Dominio.Entidades.Autenticacao;
using ConversaoMonetaria.Dominio.Entidades.Moedas;

namespace ConversaoMonetaria.Aplicacao.Automapper;

public class DomainToViewModelMappingProfile : Profile
{
    public DomainToViewModelMappingProfile()
    {
        ConfigureAutenticacaoMap();
        ConfigureMoedaMap();
    }

    private void ConfigureAutenticacaoMap()
    {
        CreateMap<Autenticacao, AutenticacaoRespostaViewModel>()
            .ForMember(o => o.Senha, options => options.MapFrom(o => o.Senha))
            .ForMember(o => o.Usuario, options => options.MapFrom(o => o.Usuario));
    }

    private void ConfigureMoedaMap()
    {
        CreateMap<Moeda, MoedaRespostaViewModel>();
    }
}