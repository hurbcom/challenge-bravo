using ConversaoMonetaria.Api.Controllers;
using ConversaoMonetaria.Dominio.Core.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq.AutoMock;
using Xunit;

namespace ConversaoMonetaria.Api.Tests.Controllers;

public class ConversaoMonetariaControllerTests
{
    private const string CategoriaTrait = "Categoria Aperesentação";
    private const string NomeCategoriaTrait = "ConversaoMonetariaController Api Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void ConversaoMonetariaController_Converter()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<ConversaoMonetariaController>();

        // Action
        var resultado =  controller.Converter("USD", "BRL", 1);

        // Assert
        resultado.Should().BeOfType<ObjectResult>();
    }
}