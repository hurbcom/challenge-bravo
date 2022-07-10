using AutoMapper;
using ConversaoMonetaria.Aplicacao.AppServices;
using ConversaoMonetaria.Aplicacao.Interfaces;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using ConversaoMonetaria.Dominio.Core.Http;
using ConversaoMonetaria.Dominio.Core.Retornos;
using ConversaoMonetaria.Dominio.Exceptions.Base;
using ConversaoMonetaria.Dominio.Interfaces.Repositorio;
using FluentAssertions;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace ConversaoMonetaria.Aplicacao.Tests.Services.Autenticacao;

public class AutenticacaoAppServiceTests
{
    private const string CategoriaTrait = "Categoria aplicacao";
    private const string NomeCategoriaTrait = "Autenticacao App Service Testes";

    private readonly AutenticacaoAppServiceTestsFixture _autenticacaoAppServiceTestsFixture;
    private readonly AutenticacaoAppService _autenticacaoAppService;

    public AutenticacaoAppServiceTests()
    {
        _autenticacaoAppServiceTestsFixture = new AutenticacaoAppServiceTestsFixture();
        _autenticacaoAppService = _autenticacaoAppServiceTestsFixture.ObterAutenticacaoAppService();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoAppService_Autenticar_DeveAutenticar()
    {
        // Arrange
        var autenticacaoRequisicaoViewModel = _autenticacaoAppServiceTestsFixture.GerarAutenticacaoRequisicaoViewModelValida();
        var autenticacao = _autenticacaoAppServiceTestsFixture.GerarAutenticacaoValida();

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IMapper>()
            .Setup(a => a.Map<Dominio.Entidades.Autenticacao.Autenticacao>(It.IsAny<AutenticacaoViewModel>()))
            .Returns(autenticacao);

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IMapper>()
            .Setup(m => m.Map<AutenticacaoRespostaViewModel>(It.IsAny<Dominio.Entidades.Autenticacao.Autenticacao>()))
            .Returns(_autenticacaoAppServiceTestsFixture.GerarAutenticacaoRespostaViewModelValido());

        // Action
        var resultado = _autenticacaoAppService.Autenticar(autenticacaoRequisicaoViewModel);

        // Assert
        resultado.EhFalha().Should().BeFalse();
        resultado.Result.Should().NotBe(null);
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoAppService_Autenticar_NaoDeveAutenticarSeEntidadeEstaInvalida()
    {
        // Arrange
        var autenticacaoRequisicaoViewModel =
            _autenticacaoAppServiceTestsFixture.GerarAutenticacaoRequisicaoViewModelInvalida();
        var autenticacao = _autenticacaoAppServiceTestsFixture.GerarAutenticacaoInvalida();

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IMapper>()
            .Setup(a => a.Map<Dominio.Entidades.Autenticacao.Autenticacao>(It.IsAny<AutenticacaoViewModel>()))
            .Returns(autenticacao);

        _autenticacaoAppServiceTestsFixture.Mocker.GetMock<IAutenticacaoRepositorio>()
            .Setup(a => a.Autenticar(It.IsAny<Dominio.Entidades.Autenticacao.Autenticacao>()))
            .Returns( new NaoAutorizadoException());

        // Action
        var resultado = _autenticacaoAppService.Autenticar(autenticacaoRequisicaoViewModel);

        // Assert
        resultado.EhFalha().Should().BeTrue();
        resultado.Result.Should().Be(null);
    }

}