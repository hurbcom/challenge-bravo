using Cuco.Application.Contracts.Requests;
using Cuco.Application.Services;
using Cuco.Application.Services.Implementations;
using Moq;

namespace Cuco.Application.Tests.CurrencyConversion;

public class CurrencyConversionServiceTests
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";

    private const string CouldNotFindCurrenciesValueMessageBase =
        "Couldn't get the value in dollar from the currency with symbol: ";

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
            Assert.That(result.Details, Is.EqualTo(SameCurrencyMessage));
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

        var result = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.Null);
            Assert.That(result.Details, Is.EqualTo(CouldNotFindCurrenciesValueMessageBase + "not"));
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

        var result = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.Null);
            Assert.That(result.Details, Is.EqualTo(CouldNotFindCurrenciesValueMessageBase + fromCurrency
                + '\n' + CouldNotFindCurrenciesValueMessageBase + toCurrency));
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

        var result = await _currencyConversionService.ConvertCurrency(new CurrencyConversionRequest
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount,
                Is.EqualTo(fromCurrencyValue * amount / toCurrencyValue));
            Assert.That(result.Details, Is.EqualTo($"Successfully converted from {fromCurrency} to {toCurrency}"));
        });
    }
}