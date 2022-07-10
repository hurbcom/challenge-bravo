using ConversaoMonetaria.Api.Controllers;
using ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq.AutoMock;
using Xunit;

namespace ConversaoMonetaria.Api.Tests.Controllers;

public class AutenticacaoControllerTests
{
    private const string CategoriaTrait = "Categoria Aperesentação";
    private const string NomeCategoriaTrait = "AutenticacaoController Api Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void AutenticacaoController_Autenticar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<AutenticacaoController>();

        // Action
        var resultado = controller.Autenticar(new AutenticacaoViewModel());

        // Assert
        resultado.Should().BeOfType<OkObjectResult>();
    }
}