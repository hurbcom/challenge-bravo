using Cuco.Application.Contracts.Requests;
using Cuco.Application.Services;
using Cuco.Application.Services.Implementations;
using Cuco.Commons.Resources;
using Moq;

namespace Cuco.Application.Tests.CurrencyConversion;

public class CurrencyConversionServiceTests
{
    private readonly Mock<IConvertToDollarService> _getCurrencyInUsdServiceMock = new();

    private readonly Random _random = new();

    private CurrencyConversionService _currencyConversionService;

    [SetUp]
    public void Setup()
    {
        _currencyConversionService = new CurrencyConversionService(_getCurrencyInUsdServiceMock.Object);
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
        });
    }

    [Test]
    public async Task Convert_BothCurrenciesFoundValue_ReturnsValueAndMessage()
    {
        var amount = _random.Next();

        const string fromCurrency = "a";
        const decimal fromCurrencyValue = 5;
        const string toCurrency = "b";
        const decimal toCurrencyValue = 2;

        _getCurrencyInUsdServiceMock.Setup(g => g.Convert(It.IsAny<string[]>()))
            .ReturnsAsync((string[] symbols) =>
            {
                var values = new decimal[2];
                for (var i = 0; i < symbols.Length; i++)
                {
                    values[i] = symbols[i] switch
                    {
                        "a" => fromCurrencyValue,
                        "b" => toCurrencyValue,
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
        });
    }

    [TestCase("hasValue", "not")]
    [TestCase("not", "hasValue")]
    public async Task Convert_OneCurrenciesDidNotFindValue_ReturnsNullAndMessage(string fromCurrency, string toCurrency)
    {
        const decimal amount = 10_000m;

        _getCurrencyInUsdServiceMock.Setup(g => g.Convert(It.IsAny<string[]>()))
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

        const string fromCurrency = "a";
        const string toCurrency = "b";
        var failOutput = new decimal[] { 0, 0 };

        _getCurrencyInUsdServiceMock.Setup(g => g.Convert(It.IsAny<string[]>())).ReturnsAsync(failOutput);

        var response = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(response.ConvertedAmount, Is.Null);
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToConvertCurrenciesToDollar));
        });
    }
}