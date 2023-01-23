using Cuco.Application.Base;
using Cuco.Application.CurrencyConversion.Models;
using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.GetCurrencyInUSD.Models;
using Moq;

namespace CurrencyConversion.Application.Tests.CurrencyConversion;

public class CurrencyConversionServiceTests
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";
    private const string CouldNotFindCurrenciesValueMessageBase =
        "Couldn't get the value in dollar from the currency with symbol: ";

    private readonly Mock<IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput>> _getCurrencyInUsdServiceMock = new();

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
        var amount = _random.Next();
        const string currency = "currency";
        var result = await _currencyConversionService.Handle(new CurrencyConversionInput
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
        var amount = _random.Next();
        var failOutput = new GetCurrencyInUsdOutput { ValueInDollar = 0 };
        var validOutput = new GetCurrencyInUsdOutput { ValueInDollar = 5 };

        _getCurrencyInUsdServiceMock.Setup(g => g.Handle(It.IsAny<GetCurrencyInUsdInput>()))
            .ReturnsAsync((GetCurrencyInUsdInput i) =>
                i.Symbol == "hasValue" ? validOutput : failOutput);

        var result = await _currencyConversionService.Handle(new CurrencyConversionInput
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
        var failOutput = new GetCurrencyInUsdOutput { ValueInDollar = 0 };

        _getCurrencyInUsdServiceMock.Setup(g => g.Handle(It.IsAny<GetCurrencyInUsdInput>()))
            .ReturnsAsync(failOutput);

        var result = await _currencyConversionService.Handle(new CurrencyConversionInput
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.Null);
            Assert.That(result.Details, Is.EqualTo(CouldNotFindCurrenciesValueMessageBase + fromCurrency
                + '\n' + CouldNotFindCurrenciesValueMessageBase + toCurrency));
        });
    }

    [Test]
    public async Task Convert_BothCurrenciesFoundValue_ReturnsNullAndMessage()
    {
        var amount = _random.Next();
        const string fromCurrency = "a";
        var fromCurrencyOutput = new GetCurrencyInUsdOutput { ValueInDollar = 5 };
        const string toCurrency = "b";
        var toCurrencyOutput = new GetCurrencyInUsdOutput { ValueInDollar = 2 };

        _getCurrencyInUsdServiceMock.Setup(g => g.Handle(It.IsAny<GetCurrencyInUsdInput>()))
            .ReturnsAsync((GetCurrencyInUsdInput i) => i.Symbol == "a" ? fromCurrencyOutput : toCurrencyOutput);

        var result = await _currencyConversionService.Handle(new CurrencyConversionInput
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount,
                Is.EqualTo(toCurrencyOutput.ValueInDollar / toCurrencyOutput.ValueInDollar * amount));
            Assert.That(result.Details, Is.EqualTo($"Successfully converted from {fromCurrency} to {toCurrency}"));
        });
    }
}