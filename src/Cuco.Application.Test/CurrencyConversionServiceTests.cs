using Cuco.Application.CurrencyConversion.Services;
using Cuco.Application.GetCurrencyInUSD;
using Cuco.Domain.Currencies.Services.Repositories;
using Moq;

namespace CurrencyConversion.Application.Test;
public class CurrencyConversionServiceTests
{
    private const string SameCurrencyMessage = "The currencies are the same, therefore the amount doesn't change.";
    private const string CouldntFindCurrenciesMessage = "Couldn't get the value in dollar from the currencies.";
    private const string CouldntFindCurrenciesMessageBase = "Couldn't find the currency with symbol: ";

    private CurrencyConversionService _currencyConversionService;

    private readonly Mock<ICurrencyRepository> _currencyRepositoryMock = new();

    private Random _random = new();

    [SetUp]
    public void Setup()
    {
        var getCurrencyInUsdService = new GetCurrencyInUsdService();
        _currencyConversionService = new(getCurrencyInUsdService, _currencyRepositoryMock.Object);
    }

    [TestCase("usd", "usd")]
    [TestCase("brl", "brl")]
    public async Task Convert_SameCurrencyThatExists_ReturnsSameAmountAndMessage(string fromCurrency, string toCurrency)
    {
        var amount = _random.Next();
        _currencyRepositoryMock.Setup(r => r.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(true);

        var result = await _currencyConversionService.Handle(new()
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.EqualTo(amount));
            Assert.That(result.Details, Is.EqualTo(SameCurrencyMessage));
        });
    }

    [TestCase("exists", "not")]
    [TestCase("not", "exists")]
    public async Task Convert_OneCurrencyDoesNotExist_ReturnsNullAndMessage(string fromCurrency, string toCurrency)
    {
        var amount = _random.Next();
        _currencyRepositoryMock.Setup(r => r.ExistsBySymbolAsync(It.IsAny<string>()))
            .ReturnsAsync((string n) => n == "exists");

        var result = await _currencyConversionService.Handle(new()
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.Null);
            Assert.That(result.Details, Is.EqualTo(CouldntFindCurrenciesMessageBase+"not"));
        });
    }

    [Test]
    public async Task Convert_BothCurrenciesDoNotExist_ReturnsNullAndMessage()
    {
        var amount = _random.Next();
        const string fromCurrency = "a";
        const string toCurrency = "b";

        _currencyRepositoryMock.Setup(r => r.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);

        var result = await _currencyConversionService.Handle(new()
            { FromCurrency = fromCurrency, ToCurrency = toCurrency, Amount = amount });

        Assert.Multiple(() =>
        {
            Assert.That(result.ConvertedAmount, Is.Null);
            Assert.That(result.Details, Is.EqualTo(CouldntFindCurrenciesMessageBase + fromCurrency
                                          + '\n' + CouldntFindCurrenciesMessageBase + toCurrency));
        });
    }
}
