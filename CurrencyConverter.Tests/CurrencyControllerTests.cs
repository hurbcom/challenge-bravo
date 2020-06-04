using AutoMapper;
using CurrencyConverter.API.Controllers;
using CurrencyConverter.API.DTO;
using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Service.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;

namespace CurrencyConverter.Tests
{
    public class CurrencyControllerTests
    {
        CurrencyController _sut;

        private readonly Mock<ICurrencySrvc> _currencySrvc = new Mock<ICurrencySrvc>();
        private readonly Mock<ILogger<CurrencyController>> _logger = new Mock<ILogger<CurrencyController>>();
        private readonly Mock<IMapper> _mapper = new Mock<IMapper>();

        public CurrencyControllerTests()
        {
            _sut = new CurrencyController(_logger.Object, _currencySrvc.Object, _mapper.Object);
        }

        [Fact]
        public void GetAllCurrencies_ShouldReturnOkWithAllCurrenciesInDatabase()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);

            var usdR = new CurrencyResponse() { @base = "USD", name = "USD", rate = 0 };
            var brlR = new CurrencyResponse() { @base = usd.name, name = "BRL", rate = 0 };
            var eurR = new CurrencyResponse() { @base = usd.name, name = "EUR", rate = 0 };
            var currenciesR = new List<CurrencyResponse>() { usdR, brlR, eurR };
            _mapper.Setup(x => x.Map<List<CurrencyResponse>>(currencies)).Returns(currenciesR);

            var result = _sut.GetAllCurrencies();
            var okResult = result as OkObjectResult;

            Assert.NotNull(okResult);
            Assert.IsType<List<CurrencyResponse>>(okResult.Value);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
        }

        [Fact]
        public void CreateCurrency_ShouldReturnOk_WhenCurrencyValid()
        {
            var usd = new Currency() { id = 1, isActive = true, @base = "USD", name = "USD", rate = 1.5M, lastUpdate = DateTime.Now };
            _currencySrvc.Setup(x => x.AddCurrency(usd.name)).Returns(usd);

            var usdR = new CurrencyResponse() { @base = usd.@base, lastUpdate = usd.lastUpdate, name = usd.name, rate = usd.rate };
            _mapper.Setup(x => x.Map<CurrencyResponse>(usd)).Returns(usdR);

            var result = _sut.CreateCurrency(usd.name);
            var okResult = result as OkObjectResult;

            Assert.NotNull(okResult);
            Assert.IsType<CurrencyResponse>(okResult.Value);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
        }

        [Fact]
        public void CreateCurrency_ShouldReturnBadRequest_WhenCurrencyNotValid()
        {
            var aaa = new Currency() { name = "AAA" };
            _currencySrvc.Setup(x => x.AddCurrency(aaa.name)).Throws<Exception>();

            var result = _sut.CreateCurrency(aaa.name);
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public void CreateCurrency_ShouldReturnBadRequest_WhenCurrencyNotFilled()
        {
            var result = _sut.CreateCurrency(null);
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public void DeleteCurrency_ShouldReturnOk_WhenCurrencyExists()
        {
            var usd = new Currency() { id = 1, isActive = true, @base = "USD", name = "USD", rate = 1.5M, lastUpdate = DateTime.Now };
            _currencySrvc.Setup(x => x.DeleteCurrency(usd.name)).Returns(true);

            var result = _sut.DeleteCurrency(usd.name);
            var okResult = result as OkObjectResult;

            Assert.NotNull(okResult);
            Assert.IsType<bool>(okResult.Value);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
        }

        [Fact]
        public void DeleteCurrency_ShouldReturnBadRequest_WhenCurrencyNotFilled()
        {
            var result = _sut.DeleteCurrency(null);
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public void DeleteCurrency_ShouldReturnNotFound_WhenCurrencyNotExists()
        {
            var aaa = new Currency() { name = "AAA" };
            _currencySrvc.Setup(x => x.DeleteCurrency(aaa.name)).Returns(false);

            var result = _sut.DeleteCurrency(aaa.name);
            var NotFoundResult = result as NotFoundObjectResult;

            Assert.NotNull(NotFoundResult);
            Assert.Equal(StatusCodes.Status404NotFound, NotFoundResult.StatusCode);
        }
    }
}
