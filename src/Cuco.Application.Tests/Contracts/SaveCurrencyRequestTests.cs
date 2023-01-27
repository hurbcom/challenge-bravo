using Cuco.Application.Contracts.Requests;
using Cuco.Commons.Resources;

namespace Cuco.Application.Tests.Contracts;

[TestFixture]
public class SaveCurrencyRequestTests
{
    [TestCase("")]
    [TestCase("   ")]
    [TestCase("\n")]
    [TestCase(null)]
    public void IsValid_NullOrWhitespaceSymbol_ErrorMessage(string symbol)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = symbol,
            IsReal = true
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.SymbolMustExist));
    }

    [TestCase("a")]
    [TestCase("ab")]
    [TestCase("abcdefghijk")]
    [TestCase("abcdefghijklmno")]
    public void IsValid_SymbolTooSmallOrTooBig_ErrorMessage(string symbol)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = symbol,
            IsReal = true
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.SymbolLength));
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase("\n")]
    [TestCase(null)]
    public void IsValid_NullOrWhitespaceName_ErrorMessage(string name)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = name,
            Symbol = "symbol",
            IsReal = true
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.CurrencyNameMustExist));
    }

    [Test]
    public void IsValid_NameTooBig_ErrorMessage()
    {
        var name = new string(Enumerable.Repeat('a', 110).ToArray());
        var saveRequest = new SaveCurrencyRequest
        {
            Name = name,
            Symbol = "symbol",
            IsReal = true
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.CurrencyNameLength));
    }

    [Test]
    public void IsValid_RealCurrencyCorrectNameAndSymbol_EmptyString()
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = "symbol",
            IsReal = true
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.Null.Or.Empty);
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase("\n")]
    [TestCase(null)]
    public void IsValid_NotRealCurrencyEmptyOrWhitespaceBaseCurrencySymbol_EmptyString(string baseCurrencySymbol)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = "symbol",
            IsReal = false,
            BaseCurrencySymbol = baseCurrencySymbol,
            ValueInBaseCurrency = 10
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.BaseCurrencyMustExistForSaving));
    }

    [TestCase("a")]
    [TestCase("ab")]
    [TestCase("abcdefghijk")]
    [TestCase("abcdefghijklmno")]
    public void IsValid_NotRealCurrencyTooShortOrTooBigBaseCurrencySymbol_EmptyString(string baseCurrencySymbol)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = "symbol",
            IsReal = false,
            BaseCurrencySymbol = baseCurrencySymbol,
            ValueInBaseCurrency = 10
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.SymbolLength));
    }

    [TestCase(0)]
    [TestCase(-10)]
    public void IsValid_NotRealCurrencyZeroOrLessValueInBaseCurrency_EmptyString(decimal value)
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "name",
            Symbol = "symbol",
            IsReal = false,
            BaseCurrencySymbol = "baseSymbol",
            ValueInBaseCurrency = value
        };

        var errorMessage = saveRequest.IsValid();

        Assert.That(errorMessage, Is.EqualTo(ErrorResources.ValueInBaseCurrencyMustBeGreaterThanZero));
    }
}