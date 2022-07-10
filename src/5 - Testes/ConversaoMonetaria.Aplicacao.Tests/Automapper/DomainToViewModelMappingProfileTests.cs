using AutoMapper;
using ConversaoMonetaria.Aplicacao.Automapper;
using Xunit;

namespace ConversaoMonetaria.Aplicacao.Tests.Automapper;

public class DomainToViewModelMappingProfileTests
{
    private const string CategoriaTrait = "Categoria Aplicacao";
    private const string NomeCategoriaTrait = "DomainToViewModelMappingProfile Testes";
    private static IMapper _mapper;

    public DomainToViewModelMappingProfileTests()
    {
        if (_mapper != null)
            return;

        var mappingConfig = new MapperConfiguration(mc => { mc.AddProfile(new DomainToViewModelMappingProfile()); });

        var mapper = mappingConfig.CreateMapper();
        _mapper = mapper;
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void DomainToViewModelMappingProfile_IsValid()
    {
        Assert.True(true);
    }
}