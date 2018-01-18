using AutoMapper;
using Project.WebApi.Mappers;

namespace Project.WebApi.Helpers
{
    /// <summary>
    /// This class is used to build the bridge between the DTO class and ViewModel class, 
    /// supporting the functionality of the automapper.
    /// </summary>
    public class AutoMepperHelper
    {
        /// <summary>
        /// This method is used to register the relationship between DTO and ViewModel classes
        /// in the automapper (object mapping) process.
        /// </summary>
        public static void RegisterMappings()
        {
            Mapper.Initialize(i => {

                i.AddProfile<DtoToViewModelMap>();
                i.AddProfile<ViewModelToDomainMap>();
            });
        }
    }
}