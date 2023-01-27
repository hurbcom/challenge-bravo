using Cuco.Application.Services.Implementations;
using Cuco.Commons.Base;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Moq;

namespace Cuco.Application.Tests.Services;

public class GetDollarValueServiceTests
{
    private GetDollarValueValueService _getDollarValueValueService;
    private readonly Mock<ICurrencyRepository> _currencyRepositoryMock = new();
    private readonly Mock<IRedisCache> _redisCacheMock = new();

    [SetUp]
    public void Setup()
    {
        _getDollarValueValueService = new GetDollarValueValueService(_currencyRepositoryMock.Object, _redisCacheMock.Object);
    }

    [Test]
    public async Task Convert_EmptyArray_ReturnEmptyArray()
    {
        var result = await _getDollarValueValueService.Convert(Array.Empty<string>());

        Assert.That(result, Is.Empty);
    }

    [TestCase(null)]
    [TestCase("")]
    public async Task Convert_ArrayWithEmptyOrNullString_ReturnEmptyArray(string symbol)
    {
        var result = await _getDollarValueValueService.Convert(new[] { symbol });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(0));
        });
    }

    [TestCase(null, null)]
    [TestCase(null, "")]
    [TestCase("", null)]
    [TestCase("", "")]
    public async Task Convert_ArrayWithEmptyOrNullStrings_ReturnEmptyArray(string symbol1, string symbol2)
    {
        var result = await _getDollarValueValueService.Convert(new[] { symbol1, symbol2 });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(2));
            Assert.That(result.All(r => r.Equals(0)));
        });
    }

    [Test]
    public async Task Convert_ArrayWithNotFoundCurrency_ReturnEmptyArray()
    {
        _redisCacheMock.Setup(r => r.GetAsync(It.IsAny<string>())).ReturnsAsync(string.Empty);
        _currencyRepositoryMock.Setup(c => c.GetBySymbolAsync(It.IsAny<string>())).ReturnsAsync(default(Currency));

        var result = await _getDollarValueValueService.Convert(new[] { "a" });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(1));
            Assert.That(result.All(r => r.Equals(0)));
        });
    }

    [Test]
    public async Task Convert_ArrayWithBaseCurrency_ReturnEmptyArray()
    {
        _redisCacheMock.Setup(r => r.GetAsync(It.IsAny<string>())).ReturnsAsync(string.Empty);
        _currencyRepositoryMock.Setup(c => c.GetBySymbolAsync(It.IsAny<string>())).ReturnsAsync(default(Currency));

        var result = await _getDollarValueValueService.Convert(new[] { "usd" });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(1));
            Assert.That(result.All(r => r.Equals(1)));
        });
    }

    [Test]
    public async Task Convert_ArrayWithFoundCurrencyInDb_ReturnEmptyArray()
    {
        var currency = new Currency("Real", "BRL", 6, DateTime.Now, true);

        _redisCacheMock.Setup(r => r.GetAsync(It.IsAny<string>())).ReturnsAsync(string.Empty);
        _currencyRepositoryMock.Setup(c => c.GetBySymbolAsync(It.IsAny<string>())).ReturnsAsync((string symbol) =>
            symbol == "BRL" ? currency : null);

        var result = await _getDollarValueValueService.Convert(new[] { currency.Symbol });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(currency.ValueInDollar));
        });
    }

    [Test]
    public async Task Convert_ArrayWithFoundCurrencyInRedis_ReturnEmptyArray()
    {
        const string symbol = "MPI";
        const string symbolValueInCache = "3.14159265";
        const decimal symbolValueInDecimal = 3.14159265m;

        _redisCacheMock.Setup(r => r.GetAsync(It.IsAny<string>()))
            .ReturnsAsync((string s) => s == symbol ? symbolValueInCache : null);
        _currencyRepositoryMock.Setup(c => c.GetBySymbolAsync(It.IsAny<string>())).ReturnsAsync(default(Currency));

        var result = await _getDollarValueValueService.Convert(new[] { symbol });

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Empty);
            Assert.That(result, Has.Length.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(symbolValueInDecimal));
        });
    }
}