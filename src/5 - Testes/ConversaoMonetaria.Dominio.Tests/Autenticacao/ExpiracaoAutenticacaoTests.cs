using ConversaoMonetaria.Dominio.Autenticacao;
using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Autenticacao;

public class ExpiracaoAutenticacaoTests
{
    private const string CategoriaTrait = "Categoria Domnio";
    private const string NomeCategoriaTrait = "Autenticacao Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void ExpiracaoAutenticacao_GetSet_DeveBuscarSetar()
    {
        // Arrange // Action
        var expiracaoAutenticacao = new ExpiracaoAutenticacao
            {TempoExpiracaoAutenticacaoMinutos = 10};

        // Assert
        expiracaoAutenticacao.TempoExpiracaoAutenticacaoMinutos.Should().Be(10);
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void ExpiracaoAutenticacao_GetSet_DeveBuscarPadraoQuandoNaoSetado()
    {
        // Arrange
        var expiracaoAutenticacao = new ExpiracaoAutenticacao();

        // Assert
        expiracaoAutenticacao.TempoExpiracaoAutenticacaoMinutos.Should().Be(60);
    }
}