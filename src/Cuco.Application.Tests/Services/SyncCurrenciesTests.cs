using Cuco.Application.Adapters;
using Cuco.Application.Contracts.Responses;
using Cuco.Application.Services.Implementations;
using Cuco.Commons.Base;
using Cuco.Commons.Resources;
using Cuco.Domain.Currencies.Models.Entities;
using Cuco.Domain.Currencies.Services.Repositories;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Cuco.Application.Tests.Services;

public class SyncCurrenciesTests
{
    private SyncCurrenciesService _syncCurrenciesService;
    private readonly Mock<ICurrencyExchangeRateAdapter> _currencyExchangeRateAdapterMock = new();
    private readonly Mock<ICurrencyRepository> _currencyRepositoryMock = new();
    private readonly Mock<IRedisCache> _redisCacheMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    [SetUp]
    public void Setup()
    {
        _syncCurrenciesService = new(_currencyExchangeRateAdapterMock.Object,
            _currencyRepositoryMock.Object,
            _redisCacheMock.Object,
            _unitOfWorkMock.Object);
    }

    [Test]
    public async Task SyncCurrencies_NullExchangeRatesResult_ErrorMessage()
    {
        _currencyExchangeRateAdapterMock.Setup(c => c.GetAllRates())
            .ReturnsAsync(default(ExchangeRateResponse));

        var response = await _syncCurrenciesService.SyncCurrencies();

        Assert.Multiple(() =>
        {
            Assert.That(response.Timestamp, Is.EqualTo(0));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status502BadGateway));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToRetrieveExchangeRatesFromExternalApi));
        });
    }

    [Test]
    public async Task SyncCurrencies_EmptyExchangeRates_ErrorMessage()
    {
        var exchangeRatesResponse = new ExchangeRateResponse
        {
            Timestamp = 0,
            Rates = new Dictionary<string, decimal>()
        };
        _currencyExchangeRateAdapterMock.Setup(c => c.GetAllRates())
            .ReturnsAsync(exchangeRatesResponse);

        var response = await _syncCurrenciesService.SyncCurrencies();

        Assert.Multiple(() =>
        {
            Assert.That(response.Timestamp, Is.EqualTo(0));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status502BadGateway));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToRetrieveExchangeRatesFromExternalApi));
        });
    }

    [Test]
    public async Task SyncCurrencies_NotEmptyRatesNullCurrencies_ErrorMessage()
    {
        var exchangeRatesResponse = new ExchangeRateResponse
        {
            Timestamp = 100,
            Rates = new Dictionary<string, decimal>()
            {
                ["USD"] = 1,
                ["BRL"] = 5
            }
        };
        _currencyExchangeRateAdapterMock.Setup(c => c.GetAllRates())
            .ReturnsAsync(exchangeRatesResponse);
        _currencyRepositoryMock.Setup(c => c.GetAllAsync())
            .ReturnsAsync(default(IEnumerable<Currency>));

        var response = await _syncCurrenciesService.SyncCurrencies();

        Assert.Multiple(() =>
        {
            Assert.That(response.Timestamp, Is.EqualTo(0));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToGetListOfCurrencies));
        });
    }

    [Test]
    public async Task SyncCurrencies_NotEmptyRatesEmptyCurrencies_ErrorMessage()
    {
        var exchangeRatesResponse = new ExchangeRateResponse
        {
            Timestamp = 100,
            Rates = new Dictionary<string, decimal>()
            {
                ["USD"] = 1,
                ["BRL"] = 5
            }
        };
        var currencies = new List<Currency>(0);
        _currencyExchangeRateAdapterMock.Setup(c => c.GetAllRates())
            .ReturnsAsync(exchangeRatesResponse);
        _currencyRepositoryMock.Setup(c => c.GetAllAsync())
            .ReturnsAsync(currencies);

        var response = await _syncCurrenciesService.SyncCurrencies();

        Assert.Multiple(() =>
        {
            Assert.That(response.Timestamp, Is.EqualTo(0));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status503ServiceUnavailable));
            Assert.That(response.Details, Is.EqualTo(ErrorResources.FailedToGetListOfCurrencies));
        });
    }

    [Test]
    public async Task SyncCurrencies_SuccessfullySynced_ReturnTimeStamp()
    {
        var timestamp = 100;
        var exchangeRatesResponse = new ExchangeRateResponse
        {
            Timestamp = timestamp,
            Rates = new Dictionary<string, decimal>()
            {
                ["USD"] = 1,
                ["BRL"] = 5
            }
        };
        var currencies = new List<Currency>()
        {
            new("Real", "BRL", 6m, DateTime.Now, true),
            new("Dollar", "USD", 1m, DateTime.Now, true),
            new("Euro", "Euro", 0.9m, DateTime.Now, true),
            new("Bitcoin", "BTC", 0.00004m, DateTime.Now, true),
            new("Ethereum", "ETH", 0.001m, DateTime.Now, true),
        };

        _currencyExchangeRateAdapterMock.Setup(c => c.GetAllRates())
            .ReturnsAsync(exchangeRatesResponse);
        _currencyRepositoryMock.Setup(c => c.GetAllAsync())
            .ReturnsAsync(currencies);
        _redisCacheMock.Setup(r => r.ExistsAsync(It.IsAny<string>())).ReturnsAsync(true);
        _unitOfWorkMock.Setup(u => u.Commit()).Returns(true);

        var response = await _syncCurrenciesService.SyncCurrencies();

        Assert.Multiple(() =>
        {
            Assert.That(response.Timestamp, Is.EqualTo(timestamp));
            Assert.That(response.StatusCode, Is.EqualTo(StatusCodes.Status200OK));
            Assert.That(response.Details, Is.EqualTo(DetailsResources.SuccessfullySyncedCurrencies));
        });
    }
}