using AutoMapper;
using Project.WebApi.Mappers;

namespace Project.WebApi.Helpers
{
    public class AutoMepperHelper
    {
        public static void RegisterMappings()
        {
            Mapper.Initialize(i => {

                i.AddProfile<DomainToViewModelMap>();
                i.AddProfile<ViewModelToDomainMap>();
            });
        }
    }
}