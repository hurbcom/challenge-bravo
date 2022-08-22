using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using DataAccess.Repository;
using Microsoft.AspNetCore.Mvc;
using Web_Api.Service;
using Web_Api.Models.Api;
using Web_Api.Models.Currency;
using Web_Api.Models.Currency.Convertion;

namespace Web_Api.Controllers;

[Route("currency")]
[ApiController]
public class CurrencyConvertionController : ControllerBase
{
    private CurrencyConvertionService CfService;

    [HttpGet]
    public ConvertionFactorDto[]? GetConvertionfactorList()
    {
        try
        {
            return CfService.GetConvertionFactorList();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public CurrencyConvertionController(IConfiguration? configuration, ICurrencyConvertionService cfService)
    {
        CfService = (CurrencyConvertionService) cfService;
    }

    [HttpPost]
    [Route("convert")]
    public ConvertionFactorDto AddConvertion([FromBody] ConvertionFactorDto factor)
    {
        try
        {
            factor = CfService.AddConvertion(factor);
        }
        catch (Exception e)
        {
            throw;
        }
            
        return factor;
    }

    [HttpDelete]
    [Route("convert")]
    public ConvertionFactorDto DeleteConvertion([FromQuery] ConvertionQueryDto dto)
    {
        var factor = new ConvertionFactorDto()
        {
            Currency1 = new BaseCurrency() { Coin = dto.from },
            Currency2 = new BaseCurrency() { Coin = dto.to }
        };
        try
        {
            return CfService.DeleteConvertion(factor);
        }
        catch (Exception)
        {

            throw;
        }
    }

    [HttpGet]
    [Route("convert")]
    public IConvertionDto GetConvertion([FromQuery] ConvertionQueryDto dto)
    {
        try
        {
            return CfService.GetConvertion(dto);
        }
        catch (Exception)
        {
            throw;
        }
    }
}