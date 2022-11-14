using AutoMapper;
using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;

namespace HURB.Application.Mapper
{
    public static class AutoMapperConfig
    {
        public static IMapper GetMappings()
        {
            var config = new MapperConfiguration(cfg =>
            {
                #region MAPPER REQUEST

                AddCurrencyRequest.Mapping(cfg);
                UpdateCurrencyRequest.Mapping(cfg);

                #endregion

                #region MAPPER RESPONSE

                GetCurrencyResponse.Mapping(cfg);

                #endregion

                cfg.AllowNullCollections = true;
            });

            try
            {
                config.AssertConfigurationIsValid();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return config.CreateMapper();
        }
    }
}
