using Cuco.Application.Base;
using Cuco.Application.Currencies.AddCurrency.Models;
using Cuco.Application.Currencies.DeleteCurrency.Models;
using Cuco.Application.Currencies.SyncCurrencies.Models;
using Cuco.Application.Currencies.UpdateCurrency.Models;
using Cuco.Commons;
using Cuco.Domain.Currencies.Models.Entities;
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
    [ProducesResponseType(typeof(Result<IEnumerable<Currency>>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllAsync()
    {
        try
        {
            var result = new Result<IEnumerable<Currency>>
            {
                Output = await _currencyRepository.GetAllAsNoTrackingAsync()
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
    [ProducesResponseType(typeof(Result<Currency>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetBySymbolValueAsync(string symbol)
    {
        try
        {
            var result = new Result<Currency>
            {
                Output = await _currencyRepository.GetBySymbolAsNoTrackingAsync(symbol)
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
    [ProducesResponseType(typeof(Result<AddCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> AddAsync(
        [FromServices] IService<AddCurrencyInput, AddCurrencyOutput> service,
        [FromBody] AddCurrencyInput input)
    {
        try
        {
            var result = new Result<AddCurrencyOutput>
            {
                Output = await service.Handle(input)
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPut]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(Result<UpdateCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> UpdateAsync(
        [FromServices] IService<UpdateCurrencyInput, UpdateCurrencyOutput> service,
        [FromBody] UpdateCurrencyInput input)
    {
        try
        {
            var result = new Result<UpdateCurrencyOutput>
            {
                Output = await service.Handle(input)
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
    [ProducesResponseType(typeof(Result<DeleteCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteAsync(
        [FromServices] IService<DeleteCurrencyInput, DeleteCurrencyOutput> service,
        string symbol)
    {
        try
        {
            var result = new Result<DeleteCurrencyOutput>
            {
                Output = await service.Handle(new DeleteCurrencyInput { Symbol = symbol })
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
    [Authorize(Roles = "ADMIN,SYNC")]
    [ProducesResponseType(typeof(Result<SyncCurrenciesOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> SyncCurrenciesAsync(
        [FromServices] IService<SyncCurrenciesInput, SyncCurrenciesOutput> service)
    {
        try
        {
            var result = new Result<SyncCurrenciesOutput>
            {
                Output = await service.Handle(default)
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}