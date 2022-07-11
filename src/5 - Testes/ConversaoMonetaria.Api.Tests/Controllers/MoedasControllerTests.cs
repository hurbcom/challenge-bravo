using ConversaoMonetaria.Api.Controllers;
using ConversaoMonetaria.Aplicacao.ViewModels.Moeda;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq.AutoMock;
using Xunit;

namespace ConversaoMonetaria.Api.Tests.Controllers;

public class MoedasControllerTests
{
    private const string CategoriaTrait = "Categoria Aperesentação";
    private const string NomeCategoriaTrait = "MoedasController Api Testes";

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void MoedasController_Listar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<MoedasController>();

        // Action
        var resultado = controller.Listar().Result;

        // Assert
        resultado.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void MoedasController_Buscar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<MoedasController>();

        // Action
        var resultado = controller.Buscar(1).Result;

        // Assert
        resultado.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void MoedasController_Deletar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<MoedasController>();

        // Action
        var resultado = controller.Deletar(1).Result;

        // Assert
        resultado.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void MoedasController_Atualizar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<MoedasController>();

        // Action
        var resultado = controller.Atualizar(1, new MoedaRequisicaoViewModel()).Result;

        // Assert
        resultado.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    [Trait(CategoriaTrait, NomeCategoriaTrait)]
    public void MoedasController_Salvar()
    {
        // Arrange
        var mocker = new AutoMocker();
        var controller = mocker.CreateInstance<MoedasController>();

        // Action
        var resultado = controller.Salvar(new MoedaRequisicaoViewModel()).Result;

        // Assert
        resultado.Should().BeOfType<CreatedResult>();
    }


}