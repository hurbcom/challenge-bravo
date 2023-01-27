using Cuco.Application.Contracts.Requests;
using Cuco.Application.Services;
using Cuco.Application.Services.Implementations;
using Cuco.Commons.Base;
using Cuco.Commons.Redis;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Cuco.Application.Tests.Services;

public class AddCurrencyServiceTests
{
    private readonly Mock<ICurrencyConversionService> _currencyConversionServiceMock = new();
    private readonly Mock<ICurrencyRepository> _currencyRepositoryMock = new();
    private readonly Mock<IRedisCache> _redisCacheMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();


    private AddCurrencyService _addCurrencyService;
    [SetUp]
    public void Setup()
    {
        _addCurrencyService = new AddCurrencyService(_currencyConversionServiceMock.Object,
            _currencyRepositoryMock.Object,
            _redisCacheMock.Object,
            _unitOfWorkMock.Object);
    }

    [Test]
    public async Task AddCurrency_NotValidCurrency_ReturnSomeError()
    {
        var errorMessage = "Some Error In Validation";
        var saveRequestMock = new Mock<SaveCurrencyRequest>();
        saveRequestMock.Setup(s => s.IsValid()).Returns(errorMessage);

        var response = await _addCurrencyService.AddCurrency(saveRequestMock.Object);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
            Assert.That(response.Details, Is.EqualTo(errorMessage));
            Assert.That(response.Currency, Is.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidAlreadyExistsCurrency_ReturnError()
    {
        var saveRequestMock = new Mock<SaveCurrencyRequest>();
        saveRequestMock.Setup(s => s.IsValid()).Returns(string.Empty);
        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(true);

        var response = await _addCurrencyService.AddCurrency(saveRequestMock.Object);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.AddingCurrencyThatAlreadyExists));
            Assert.That(response.Currency, Is.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidNewRealCurrencyDidNotFindSymbols_ReturnError()
    {
        var saveRequestMock = new Mock<SaveCurrencyRequest>();
        saveRequestMock.Setup(s => s.IsValid()).Returns(string.Empty);
        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);
        _redisCacheMock.Setup(c => c.GetAsync(It.IsAny<string>())).ReturnsAsync(string.Empty);

        var response = await _addCurrencyService.AddCurrency(saveRequestMock.Object);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.CurrencyCreationProblem));
            Assert.That(response.Currency, Is.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidNewRealCurrencyFoundSymbolsNotAvailable_ReturnError()
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "Test Currency",
            Symbol = "Not Real",
            IsReal = true
        };
        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);
        _redisCacheMock.Setup(c => c.GetAsync(It.IsAny<string>())).ReturnsAsync("[\"USD\", \"BRL\", \"TEST\"]");

        var response = await _addCurrencyService.AddCurrency(saveRequest);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.CurrencyCreationProblem));
            Assert.That(response.Currency, Is.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidNewRealCurrencyFoundSymbolsAvailableFailedToParse_ReturnError()
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "Test Currency",
            Symbol = "TEST",
            IsReal = true
        };
        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);
        _redisCacheMock.Setup(c => c.GetAsync(RedisValues.CurrencySymbolsKey)).ReturnsAsync("[\"USD\", \"BRL\", \"TEST\"]");
        _redisCacheMock.Setup(c => c.GetAsync(saveRequest.Symbol)).ReturnsAsync("not decimal");

        var response = await _addCurrencyService.AddCurrency(saveRequest);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.CurrencyCreationProblem));
            Assert.That(response.Currency, Is.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidNewRealCurrencyFoundSymbolsAvailableParsedCommitFailed_ReturnErrorAndFailedCurrency()
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "Test Currency",
            Symbol = "TEST",
            IsReal = true
        };

        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);
        _redisCacheMock.Setup(c => c.GetAsync(RedisValues.CurrencySymbolsKey)).ReturnsAsync("[\"USD\", \"BRL\", \"TEST\"]");
        _redisCacheMock.Setup(c => c.GetAsync(saveRequest.Symbol)).ReturnsAsync("100");
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(false);

        var response = await _addCurrencyService.AddCurrency(saveRequest);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToCommitChanges));
            Assert.That(response.Currency, Is.Not.Null);
        });
    }

    [Test]
    public async Task AddCurrency_ValidNewRealCurrencyFoundSymbolsAvailableParsedCommitWorked_ReturnDetailsAndCurrency()
    {
        var saveRequest = new SaveCurrencyRequest
        {
            Name = "Test Currency",
            Symbol = "TEST",
            IsReal = true
        };
        _currencyRepositoryMock.Setup(c => c.ExistsBySymbolAsync(It.IsAny<string>())).ReturnsAsync(false);
        _redisCacheMock.Setup(c => c.GetAsync(RedisValues.CurrencySymbolsKey)).ReturnsAsync("[\"USD\", \"BRL\", \"TEST\"]");
        _redisCacheMock.Setup(c => c.GetAsync(saveRequest.Symbol)).ReturnsAsync("100");
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(true);

        var response = await _addCurrencyService.AddCurrency(saveRequest);

        Assert.Multiple(() =>
        {
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status201Created));
            Assert.That(response.Details, Is.EqualTo(DetailsResources.SuccessfullyAddedCurrency));
            Assert.That(response.Currency, Is.Not.Null);
        });
    }
}