using AutoMapper;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using Moq;
using Xunit;

namespace ConversaoMonetaria.Aplicacao.Tests.Services.Autenticacao;

public class AutenticacaoAppServiceTests
{
    private const string CategoriaTrait = "Categoria Application";
    private const string NomeCategoriaTrait = "Autenticacao App Service Testes";

    private readonly AutenticacaoAppServiceTestsFixture _autenticacaoAppServiceTestsFixture;

    public AutenticacaoAppServiceTests()
    {
        _autenticacaoAppServiceTestsFixture = new AutenticacaoAppServiceTestsFixture();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoAppService_Autenticar_DeveAutenticar()
    {
        // Arrange
        var autenticacaoRequisicaoViewModel =
            _autenticacaoAppServiceTestsFixture.GerarAutenticacaoRequisicaoViewModelValida();
        var autenticacao = _autenticacaoAppServiceTestsFixture.GerarAutenticacaoValida();

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IMapper>()
            .Setup(a => a.Map<Dominio.Entidades.Autenticacao.Autenticacao>(It.IsAny<AutenticacaoViewModel>()))
            .Returns(autenticacao);
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoAppService_Autenticar_NaoDeveAutenticarSeEntidadeEstaInvalida()
    {
        // Arrange
        var autenticacaoRequisicaoViewModel =
            _autenticacaoAppServiceTestsFixture.GerarAutenticacaoRequisicaoViewModelInvalida();
        var autenticacao = _autenticacaoAppServiceTestsFixture.GerarAutenticacaoValida();

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IMapper>()
            .Setup(a => a.Map<Dominio.Entidades.Autenticacao.Autenticacao>(It.IsAny<AutenticacaoViewModel>()))
            .Returns(autenticacao);
    }
}