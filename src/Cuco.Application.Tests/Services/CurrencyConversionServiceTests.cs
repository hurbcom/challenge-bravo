using Cuco.Application.Contracts.Requests;
using Cuco.Application.Services;
using Cuco.Application.Services.Implementations;
using Cuco.Commons.Resources;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Cuco.Application.Tests.Services;

public class CurrencyConversionServiceTests
{
    private readonly Mock<IGetDollarValueService> _getDollarValueServiceMock = new();

    private readonly Random _random = new();

    private CurrencyConversionService _currencyConversionService;

    [SetUp]
    public void Setup()
    {
        _currencyConversionService = new CurrencyConversionService(_getDollarValueServiceMock.Object);
    }

    [Test]
    public async Task Convert_SameCurrency_ReturnsSameAmountAndMessage()
    {
        const decimal amount = 10_000m;
        const string currency = "currency";

        var result = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = currency, ToCurrency = currency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.EqualTo(amount));
            Assert.That(result.Details, Is.EqualTo(DetailsResources.SameCurrencyMessage));
            Assert.That(result.StatusCode, Is.EqualTo(StatusCodes.Status200OK));
        });
    }

    [Test]
    public async Task Convert_BothCurrenciesFoundValue_ReturnsValueAndMessage()
    {
        var amount = _random.Next();

        const string fromCurrency = "abc";
        const decimal fromCurrencyValue = 5;
        const string toCurrency = "xyz";
        const decimal toCurrencyValue = 2;

        _getDollarValueServiceMock.Setup(g => g.Convert(It.IsAny<string[]>()))
            .ReturnsAsync((string[] symbols) =>
            {
                var values = new decimal[2];
                for (var i = 0; i < symbols.Length; i++)
                {
                    values[i] = symbols[i] switch
                    {
                        "abc" => fromCurrencyValue,
                        "xyz" => toCurrencyValue,
                        _ => 0
                    };
                }
                return values;
            });

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount,
                Is.EqualTo(toCurrencyValue * amount / fromCurrencyValue));
            Assert.That(response.Details, Is.EqualTo(fromCurrency.SuccessfullyConverted(toCurrency)));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status200OK));
        });
    }

    [TestCase("hasValue", "not")]
    [TestCase("not", "hasValue")]
    public async Task Convert_OneCurrenciesDidNotFindValue_ReturnsNullAndMessage(string fromCurrency, string toCurrency)
    {
        const decimal amount = 10_000m;

        _getDollarValueServiceMock.Setup(g => g.Convert(It.IsAny<string[]>()))
            .ReturnsAsync((string[] symbols) =>
            {
                var values = new decimal[2];
                for (var i = 0; i < symbols.Length; i++)
                    values[i] = symbols[i] == "hasValue" ? 5 : 0;
                return values;
            });

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToConvertCurrenciesToDollar));
        });
    }

    [Test]
    public async Task Convert_BothCurrenciesDidNotFindValue_ReturnsNullAndMessage()
    {
        var amount = _random.Next();

        const string fromCurrency = "abc";
        const string toCurrency = "xyz";
        var failOutput = new decimal[] { 0, 0 };

        _getDollarValueServiceMock.Setup(g => g.Convert(It.IsAny<string[]>())).ReturnsAsync(failOutput);

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToConvertCurrenciesToDollar));
        });
    }

    [TestCase("","")]
    [TestCase(" "," ")]
    [TestCase(null, null)]
    public async Task Convert_EmptyStrings_ReturnsNullAndMessage(string fromCurrency, string toCurrency)
    {
        var amount = _random.Next();
        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.CannotConvertFromAEmptySymbol));
        });
    }

    [Test]
    public async Task Convert_ShortStrings_ReturnsNullAndMessage()
    {
        var amount = _random.Next();

        const string fromCurrency = "a";
        const string toCurrency = "b";

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.SymbolLength));
        });
    }

    [Test]
    public async Task Convert_GetDollarValueError_ReturnsNullAndMessage()
    {
        var amount = _random.Next();

        const string fromCurrency = "abc";
        const string toCurrency = "xyz";
        _getDollarValueServiceMock.Setup(g => g.Convert(It.IsAny<string[]>())).ThrowsAsync(new Exception());

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status500InternalServerError));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.UnexpectedErrorOccurred));
        });
    }
}