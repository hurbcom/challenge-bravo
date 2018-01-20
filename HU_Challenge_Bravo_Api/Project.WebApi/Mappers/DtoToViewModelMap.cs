using AutoMapper;
using Project.Business.DTOs;
using Project.WebApi.ViewModels;

namespace Project.WebApi.Mappers
{
    /// <summary>
    /// This class is used to map all the properties from Dto to ViewModel classes.
    /// </summary>
    public class DtoToViewModelMap : Profile
    {
        /// <summary>
        /// This constructor is used to implement the mapping between Dto and ViewModels properties.
        /// </summary>
        public DtoToViewModelMap()
        {
            CreateMap<CurrencyDTO, CurrencyDataViewModel>()
                .ForMember(
                    dest => dest.BaseCurrencySymbol,
                    opt => opt.MapFrom(src => src.Symbol)
                );
        }
    }
}