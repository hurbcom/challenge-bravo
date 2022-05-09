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
                    dest => dest.Rate,
                    opt => opt.MapFrom(src => $"{src.Rate}")
                )
                .ForMember(
                    dest => dest.Custom,
                    opt => opt.MapFrom(src => true)
                )
                .ForMember(
                    dest => dest.CreatedAt,
                    opt => opt.Ignore()
                )
                .ForMember(
                    dest => dest.UpdatedAt,
                    opt => opt.Ignore()
                )
                .ReverseMap();
        }
    }
}
