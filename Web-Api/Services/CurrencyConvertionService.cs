using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using DataAccess.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using Web_Api.Models.Api;
using Web_Api.Models.Currency.Convertion;

namespace Web_Api.Service;

public interface ICurrencyConvertionService
{
    ConvertionFactorDto AddConvertion(ConvertionFactorDto factor);

    ConvertionFactorDto DeleteConvertion(ConvertionFactorDto factor);

    IConvertionDto GetConvertion(ConvertionQueryDto dto);

}

public class CurrencyConvertionService : ICurrencyConvertionService
{
    private JSONConvertionFactorRepository CfRepository;

    public CurrencyConvertionService(IConfiguration? configuration, IConvertionFactorRepository cfRepository)
    {
        CfRepository = (JSONConvertionFactorRepository)cfRepository;
    }

    public ConvertionFactorDto AddConvertion(ConvertionFactorDto factor)
    {
        if (factor.Factor == null || factor.Factor <= 0)
            throw new Exception("Must declare a Convertion Factor and it cannot be <= 0!");
        else
        {
            var _l = this.CfRepository?.Find();
            var _i = _l.FindIndex(f => f.IsCurrencyPair(factor.Currency1, factor.Currency2));
            if (_i < 0)
            {
                CfRepository?.Save(SerializableConvertionFactor.toSerializable(
                    new ConvertionFactor(factor.Currency1, factor.Currency2, (double)factor.Factor)));
            }
            else
            {
                _l[_i].Factor = _l[_i].IsReversed(factor.Currency1, factor.Currency2) ? 1 / (double)factor.Factor : (double)factor.Factor;
            }
            return factor;
        }
    }

    public ConvertionFactorDto DeleteConvertion(ConvertionFactorDto factor)
    {
        var _l = this.CfRepository?.Find();
        int _i = _l.FindIndex(f => f.IsCurrencyPair(factor.Currency1, factor.Currency2));
        if (_i >= 0)
        {
            CfRepository?.Remove(SerializableConvertionFactor.toSerializable(
                new ConvertionFactor(factor.Currency1, factor.Currency2, factor.Factor ?? 0)));
        }
        else
        {
            throw new Exception("Conversion Not found.");
        }
        return factor;
    }

    public IConvertionDto GetConvertion(ConvertionQueryDto dto)
    {
        if (dto.from == dto.to)
        {
            throw new Exception("From and To cannot be the same.");
        }
        else if (dto.amount < 0)
        {
            throw new Exception("Amount must not be negative.");
        }

        SerializableConvertionFactor? f = CfRepository?.Find(cf => cf.IsCurrencyPair(
            new BaseCurrency { Coin = dto.from },
            new BaseCurrency { Coin = dto.to }
        ))?[0];

        if (f == null)
        {
            throw new Exception("Convertion not found.");
        }

        f = SerializableConvertionFactor.toSerializable(f.IsReversed(dto.from, dto.to) ? f.Reverse() : f);

        var result = f?.Calculate(dto.amount);

        return new ConvertionDto()
        {
            From = dto.from,
            To = dto.to,
            Factor = f != null ? f.Factor : 0,
            Result = result != null ? result.Value : 0
        };
    }

    public ConvertionFactorDto[]? GetConvertionFactorList()
    {
        return CfRepository?
            .Find()
            ?.Select(cf => {
                return new ConvertionFactorDto()
                {
                    Currency1 = cf.Currency1,
                    Currency2 = cf.Currency2,
                    Factor = cf.Factor
                };
            })
            .ToArray();
    }
}