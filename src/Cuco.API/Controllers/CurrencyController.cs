using Cuco.Application.Contracts.Requests;
using Cuco.Application.Contracts.Responses;
using Cuco.Application.Services;
using Cuco.Commons;
using Cuco.Domain.Currencies.Extensions;
using Cuco.Domain.Currencies.Models.DTOs;
using Cuco.Domain.Currencies.Services.Repositories;
using Cuco.Domain.Roles.Models.Consts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/currency")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyController(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    [HttpGet("all")]
    [ProducesResponseType(typeof(IEnumerable<CurrencyDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllAsync()
    {
        try
        {
            var result = new Result<IEnumerable<CurrencyDto>>
            {
                Output = await _currencyRepository.GetAllDtoAsync()
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("{symbol}")]
    [ProducesResponseType(typeof(CurrencyDto), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetBySymbolValueAsync(string symbol)
    {
        try
        {
            var result = new Result<CurrencyDto>
            {
                Output = (await _currencyRepository.GetBySymbolAsNoTrackingAsync(symbol))?.ToDto()
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(SaveCurrencyResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult> AddAsync(
        [FromServices] IAddCurrencyService service,
        [FromBody] SaveCurrencyRequest request)
    {
        try
        {
            var result = new Result<SaveCurrencyResponse>
            {
                Output = await service.AddCurrency(request)
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpDelete("{symbol}")]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    [ProducesResponseType(typeof(DeleteCurrencyResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteAsync(
        [FromServices] IDeleteCurrencyService service,
        string symbol)
    {
        try
        {
            var result = new Result<DeleteCurrencyResponse>
            {
                Output = await service.DeleteCurrency(symbol)
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPut("sync")]
    [ProducesResponseType(typeof(SyncCurrenciesResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult> SyncCurrenciesAsync(
        [FromServices] ISyncCurrenciesService service)
    {
        try
        {
            var result = await service.SyncCurrencies();
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}