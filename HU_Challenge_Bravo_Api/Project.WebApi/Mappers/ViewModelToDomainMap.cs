using AutoMapper;
using Project.Business.DTOs;
using Project.WebApi.ViewModels;

namespace Project.WebApi.Mappers
{
    public class ViewModelToDomainMap : Profile
    {
        public ViewModelToDomainMap()
        {
            CreateMap<CurrencyDataViewModel, CurrencyDTO>()
                .ForMember(
                    dest => dest.Symbol,
                    opt => opt.MapFrom(src => src.BaseCurrencySymbol)
                );
        }
    }
}