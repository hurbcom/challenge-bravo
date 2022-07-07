using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Autenticacao;

public class AutenticacaoTests
{
    private const string CategoriaTrait = "Categoria Domain";
    private const string NomeCategoriaTrait = "Autenticacao Testes";
    private readonly AutenticacaoTestsFixture _autenticacaoTestsFixture;

    public AutenticacaoTests()
    {
        _autenticacaoTestsFixture = new AutenticacaoTestsFixture();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void Autenticacao_Validar_DeveEstarValido()
    {
        // Arrange
        var autenticacao = _autenticacaoTestsFixture.GerarAutenticacaoValida();

        // Action
        var resultado = autenticacao.Validar();

        // Assert
        resultado.IsValid.Should().BeTrue();
        resultado.Errors.Count.Should().Be(0);
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void Autenticacao_Validar_DeveEstarInvalido()
    {
        // Arrange
        var autenticacao = _autenticacaoTestsFixture.GerarAutenticacaoInvalida();


        // Action
        var resultado = autenticacao.Validar();

        // Assert
        resultado.IsValid.Should().BeFalse();
        resultado.Errors.Count.Should().Be(2);
    }
}