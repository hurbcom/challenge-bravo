using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Moeda;

public class MoedaTests
{
    private const string CategoriaTrait = "Categoria Dominio";
    private const string NomeCategoriaTrait = "Moeda Testes";
    private readonly MoedaTestsFixture _MoedaTestsFixture;

    public MoedaTests()
    {
        _MoedaTestsFixture = new MoedaTestsFixture();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void Moeda_Validar_DeveEstarValido()
    {
        // Arrange
        var Moeda = _MoedaTestsFixture.GerarMoedaValida();

        // Action
        var resultado = Moeda.Validar();

        // Assert
        resultado.IsValid.Should().BeTrue();
        resultado.Errors.Count.Should().Be(0);
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void Moeda_Validar_DeveEstarInvalido()
    {
        // Arrange
        var Moeda = _MoedaTestsFixture.GerarMoedaInvalida();

        // Action
        var resultado = Moeda.Validar();

        // Assert
        resultado.IsValid.Should().BeFalse();
        resultado.Errors.Count.Should().Be(4);
    }
}