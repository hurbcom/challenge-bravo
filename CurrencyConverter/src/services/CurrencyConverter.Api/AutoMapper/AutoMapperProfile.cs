using AutoMapper;
using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.AutoMapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CurrencyViewModel, Currency>();
            CreateMap<Currency, CurrencyViewModel>();
        }
    }
}
