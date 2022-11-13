using Flunt.Validations;
using HURB.Application.Model.Request.Currency;

namespace HURB.Application.Model.Request.Validators
{
    public class UpdateCurrencyRequestValidator : Contract<UpdateCurrencyRequest>
    {
        public UpdateCurrencyRequestValidator(UpdateCurrencyRequest model)
        {
            Requires().AreNotEquals(model.Id, Guid.Empty, "Currency Id", "Currency Id required.")
                      .IsNotNullOrWhiteSpace(model.ISOCurrencySymbol, "ISO Symbol", "ISO Symbol required.")
                      .IsLowerOrEqualsThan(model.ISOCurrencySymbol, 4, "ISO Symbol", "ISO Symbol max length 4 characters.")
                      .IsLowerOrEqualsThan(model.CurrencySymbol, 2, "Currency Symbol", "Currency symbol max length 2 characters.");
        }
    }
}
