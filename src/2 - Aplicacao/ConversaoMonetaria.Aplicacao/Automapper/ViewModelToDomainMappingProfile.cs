using AutoMapper;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Entidades.Autenticacao;

namespace ConversaoMonetaria.Aplicacao.Automapper;

public class ViewModelToDomainMappingProfile : Profile
{
    public ViewModelToDomainMappingProfile()
    {
        ConfigureAutenticacaoMap();
    }

    private void ConfigureAutenticacaoMap()
    {
        CreateMap<AutenticacaoViewModel, Autenticacao>();
    }
}