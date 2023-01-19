using Cuco.Application.AddCurrency;
using Cuco.Application.DeleteCurrency;
using Cuco.Application.GetCurrencyInUSD;
using Cuco.Application.ListCurrencies;
using Cuco.Application.UpdateCurrency;
using Microsoft.AspNetCore.Mvc;

namespace Cuco.API.Controllers;

[ApiController]
[Route("api/currency")]
public class CurrencyController : ControllerBase
{
    [HttpGet("all")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetAllAsync(
        [FromServices] IListCurrenciesService service)
    {
        return Ok(true);
    }

    [HttpGet("usd-value/{symbol}")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> GetBySymbolValueAsync(
        [FromServices] IGetCurrencyInUsdService service)
    {
        return Ok(true);
    }

    [HttpPost]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> AddAsync(
        [FromServices] IAddCurrencyService service)
    {
        return Ok(true);
    }

    [HttpPut]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> UpdateAsync(
        [FromServices] IUpdateCurrencyService service)
    {
        return Ok(true);
    }

    [HttpGet]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteAsync(
        [FromServices] IDeleteCurrencyService service)
    {
        return Ok(true);
    }
}