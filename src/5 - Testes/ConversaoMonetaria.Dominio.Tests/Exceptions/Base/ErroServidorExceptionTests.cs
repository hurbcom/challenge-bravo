using ConversaoMonetaria.Dominio.Exceptions.Base;
using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Exceptions.Base;

public class ErroServidorExceptionTests
{
    private const string CategoriaTrait = "Categoria dominio";
    private const string NomeCategoriaTrait = "Exceptions Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void ErroServidorException_IsValid()
    {
        var erroServidorException = new ErroServidorException(0, string.Empty);
        erroServidorException.Should().NotBeNull();
    }
}