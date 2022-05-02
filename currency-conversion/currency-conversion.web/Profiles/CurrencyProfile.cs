using AutoMapper;
using currency_conversion.Core.Models;
using currency_conversion.web.DTOs;

namespace currency_conversion.web.Profiles
{
    public class CurrencyProfile : Profile
    {
        public CurrencyProfile()
        {
            CreateMap<CurrencyDTO, Currency>()
                .ForMember(
                    dest => dest.Code,
                    opt => opt.MapFrom(src => $"{src.Code}")
                )
                .ForMember(
                    dest => dest.Name,
                    opt => opt.MapFrom(src => $"{src.Name}")
                )
                .ForMember(
                    dest => dest.Rate,
                    opt => opt.MapFrom(src => $"{src.Rate}")
                ).ReverseMap();
        }
    }
}
