using ConversaoMonetaria.Dominio.Exceptions.Autenticacao;
using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Exceptions.Autenticacao;

public class AutenticacaoJaRealizadaExceptionTests
{
    private const string CategoriaTrait = "Categoria dominio";
    private const string NomeCategoriaTrait = "Exceptions Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoJaRealizadaException_IsValid()
    {
        var autenticacaoJaRealizadaException = new AutenticacaoJaRealizadaException();
        autenticacaoJaRealizadaException.Should().NotBeNull();
    }
}