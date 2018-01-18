using AutoMapper;
using Project.Business.DTOs;
using Project.WebApi.ViewModels;

namespace Project.WebApi.Mappers
{
    /// <summary>
    /// This class is used to map all the properties from ViewModel to Dto classes.
    /// </summary>
    public class ViewModelToDomainMap : Profile
    {
        /// <summary>
        /// This constructor is used to implement the mapping between ViewModels and Dto's properties.
        /// </summary>
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