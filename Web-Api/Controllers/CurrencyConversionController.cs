using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using Microsoft.AspNetCore.Mvc;
using Web_Api._Mock;
using Web_Api.Models.Api;
using Web_Api.Models.Currency;
using Web_Api.Models.Currency.Convertion;

namespace Web_Api.Controllers;

[Route("currency")]
[ApiController]
public class CurrencyConvertionController : ControllerBase
{
    private List<ConvertionFactor> Factors;


    public CurrencyConvertionController(IConfiguration? configuration, IConvertionFactorsMock _mock)
    {
        Factors = new List<ConvertionFactor>(_mock);
    }

    [HttpPost]
    public ConvertionFactorDto addConvertion([FromBody] ConvertionFactorDto factor)
    {
        var _i = this.Factors.FindIndex(f => f.IsCurrencyPair(factor.Currency1, factor.Currency2));
        if( _i < 0) {
            this.Factors.Add(new ConvertionFactor(factor.Currency1, factor.Currency2, factor.Factor));
        }
        else {

            Factors[_i].Factor = Factors[_i].IsReversed(factor.Currency1, factor.Currency2) ? 1/factor.Factor : factor.Factor;
        }
            
        return factor;
    }

    [HttpGet]
    [Route("convert")]
    public IConvertionDto GetConvertion([FromQuery] ConvertionQueryDto dto)
    {
        if(dto.from == dto.to )
        {
            throw new Exception("From and To cannot be the same.");
        }
        else if (dto.amount < 0)
        {
            throw new Exception("Amount must not be negative.");
        }

        var f = this.Factors.Find(cf => cf.IsCurrencyPair(
            new BaseCurrency {Coin=dto.from},
            new BaseCurrency {Coin=dto.to}
        ));

        if(f == null)
        {
            throw new Exception("Convertion not found.");
        }

        f = f.IsReversed(dto.from, dto.to) ? f.Reverse() : f;

        var result = f?.Calculate(dto.amount);

        return new ConvertionDto() {
            From= dto.from,
            To= dto.to,
            Factor= f != null ? f.Factor : 0,
            Result= result != null ? result.Value : 0
        };
    }
}