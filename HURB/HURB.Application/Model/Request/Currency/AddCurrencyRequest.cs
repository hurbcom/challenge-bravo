using AutoMapper;
using Flunt.Notifications;
using HURB.Application.Model.Request.Validators;

namespace HURB.Application.Model.Request.Currency
{
    public class AddCurrencyRequest : Notifiable<Notification>
    {
        public string ISOCurrencySymbol { get; set; }
        public string? CurrencySymbol { get; set; }

        public bool IsValid()
        {
            AddNotifications(new AddCurrencyRequestValidator(this));
            return Notifications.Count == 0;
        }

        #region MAP

        public static void Mapping(IMapperConfigurationExpression cfg)
            => cfg.CreateMap<UpdateCurrencyRequest, Core.Entities.Currency>();

        #endregion MAP
    }
}

