using AutoMapper;
using Project.Business.DTOs;
using Project.WebApi.ViewModels;

namespace Project.WebApi.Mappers
{
    public class DomainToViewModelMap : Profile
    {
        public DomainToViewModelMap()
        {
            CreateMap<CurrencyDTO, CurrencyDataViewModel>()
                .ForMember(
                    dest => dest.BaseCurrencySymbol,
                    opt => opt.MapFrom(src => src.Symbol)
                );
        }
    }
}