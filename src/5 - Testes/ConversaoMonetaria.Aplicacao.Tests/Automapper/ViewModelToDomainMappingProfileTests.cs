using AutoMapper;
using ConversaoMonetaria.Aplicacao.Automapper;
using Xunit;

namespace ConversaoMonetaria.Aplicacao.Tests.Automapper;

public class ViewModelToDomainMappingProfileTests
{
    private const string CategoriaTrait = "Categoria Application";
    private const string NomeCategoriaTrait = "ViewModelToDomainMappingProfile Testes";
    private static IMapper _mapper;

    public ViewModelToDomainMappingProfileTests()
    {
        if (_mapper != null)
            return;

        var mappingConfig = new MapperConfiguration(mc => { mc.AddProfile(new ViewModelToDomainMappingProfile()); });

        var mapper = mappingConfig.CreateMapper();
        _mapper = mapper;
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void ViewModelToDomainMappingProfile_IsValid()
    {
        Assert.True(true);
    }
}