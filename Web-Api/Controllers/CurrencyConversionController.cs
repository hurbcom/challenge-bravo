using Microsoft.AspNetCore.Mvc;
using Web_Api.Models.Api;
using Web_Api.Models.Currency;
using Web_Api.Models.Currency.Convertion;

namespace Web_Api.Controllers;

[Route("currency")]
[ApiController]
public class CurrencyConvertionController : ControllerBase
{
    private List<ConvertionFactor> Factors;

    public CurrencyConvertionController()
    {
        Factors = new List<ConvertionFactor> {
            new ConvertionFactor (new BaseCurrency{Coin= "USD"}, new BaseCurrency {Coin= "EUR"}, 1/1.5),
            new ConvertionFactor (new BaseCurrency{Coin= "USD"}, new BaseCurrency {Coin= "BRL"}, 1/5.0),
            new ConvertionFactor (new BaseCurrency{Coin= "EUR"}, new BaseCurrency {Coin= "BRL"}, 1/6.0),
        };
    }

    [HttpGet]
    [Route("convert")]
    public IConvertionDto GetConvertion([FromQuery] ConvertionQueryDto dto)
    {
        var f = this.Factors.Find(cf => _IsCurrencyPair(
            new BaseCurrency {Coin=dto.from},
            new BaseCurrency {Coin=dto.to},
            cf.Currency1,
            cf.Currency2
        ));
        var result = f?.Currency1.Coin == dto.from ? f.Direct(dto.amount) : f?.Reverse(dto.amount);

        return new ConvertionDto() {
            From= dto.from,
            To= dto.to,
            Factor= f != null ? f.Factor : 0,
            Result= result != null ? result.Value : 0
        };
    }

    private bool _IsCurrencyPair(ICurrency curr1, ICurrency curr2, ICurrency other1, ICurrency other2)
    {
        return 
            (curr1.Coin != curr2.Coin)  && 
            (other1.Coin != other2.Coin)  && 
            (curr1.Coin == other1.Coin || curr1.Coin == other2.Coin) &&
            (curr2.Coin == other1.Coin || curr2.Coin == other2.Coin);
    }
}