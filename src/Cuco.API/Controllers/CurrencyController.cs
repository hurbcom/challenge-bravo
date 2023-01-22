using Cuco.Application.AddCurrency.Models;
using Cuco.Application.Base;
using Cuco.Application.DeleteCurrency.Models;
using Cuco.Application.GetCurrencyInUSD.Models;
using Cuco.Application.ListCurrencies.Models;
using Cuco.Application.SyncCurrencies.Models;
using Cuco.Application.UpdateCurrency.Models;
using Cuco.Commons;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/currency")]
public class CurrencyController : ControllerBase
{
    [HttpGet("all")]
    [ProducesResponseType(typeof(Result<ListCurrenciesOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllAsync(
        [FromServices] IService<ListCurrenciesInput, ListCurrenciesOutput> service)
    {
        try
        {
            var result = new Result<ListCurrenciesOutput>()
            {
                Output = await service.Handle(new())
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("usd-value/{symbol}")]
    [ProducesResponseType(typeof(Result<GetCurrencyInUsdOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetBySymbolValueAsync(
        [FromServices] IService<GetCurrencyInUsdInput, GetCurrencyInUsdOutput> service,
        string symbol)
    {
        try
        {
            var result = new Result<GetCurrencyInUsdOutput>()
            {
                Output = await service.Handle(new() {Symbol = symbol})
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
    [ProducesResponseType(typeof(Result<AddCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> AddAsync(
        [FromServices] IService<AddCurrencyInput, AddCurrencyOutput> service,
        [FromBody] AddCurrencyInput input)
    {
        try
        {
            var result = new Result<AddCurrencyOutput>()
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
    [ProducesResponseType(typeof(Result<UpdateCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> UpdateAsync(
        [FromServices] IService<UpdateCurrencyInput, UpdateCurrencyOutput> service,
        [FromBody] UpdateCurrencyInput input)
    {
        try
        {
            var result = new Result<UpdateCurrencyOutput>()
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
    [ProducesResponseType(typeof(Result<DeleteCurrencyOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteAsync(
        [FromServices] IService<DeleteCurrencyInput, DeleteCurrencyOutput> service,
        string symbol)
    {
        try
        {
            var result = new Result<DeleteCurrencyOutput>()
            {
                Output = await service.Handle(new() { Symbol = symbol })
            };
            return Ok(result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("sync")]
    [ProducesResponseType(typeof(Result<SyncCurrenciesOutput>), StatusCodes.Status200OK)]
    public async Task<ActionResult> SyncCurrenciesAsync(
        [FromServices] IService<SyncCurrenciesInput, SyncCurrenciesOutput> service)
    {
        try
        {
            var result = new Result<SyncCurrenciesOutput>()
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