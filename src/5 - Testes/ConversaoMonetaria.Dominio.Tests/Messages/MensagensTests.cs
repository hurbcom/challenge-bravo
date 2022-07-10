using FluentAssertions;
using Xunit;

namespace ConversaoMonetaria.Dominio.Tests.Messages;

public class MensagensTests
{
    private const string CategoriaTrait = "Categoria dominio";
    private const string NomeCategoriaTrait = "Mensagens Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void Mensagens_AutenticacaoNaoPermitida_DeveRetornar()
    {
        // Action
        var resultado = Mensagens.Mensagens.AutenticacaoNaoPermitida();

        // Assert
        resultado.Should().NotBeNull();
        resultado.CodigoMensagem.Should().Be(112);
    }
}