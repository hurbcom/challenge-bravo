using Flunt.Validations;
using HURB.Application.Model.Request.Currency;

namespace HURB.Application.Model.Request.Validators
{
    public class AddCurrencyRequestValidator : Contract<AddCurrencyRequest>
    {
        public AddCurrencyRequestValidator(AddCurrencyRequest model)
        {
            Requires().IsNotNullOrWhiteSpace(model.ISOCurrencySymbol, "ISO Symbol", "ISO Symbol required.")
                      .IsLowerOrEqualsThan(model.ISOCurrencySymbol, 4, "ISO Symbol", "ISO Symbol max length 4 characters.")
                      .IsLowerOrEqualsThan(model.CurrencySymbol, 2, "Currency Symbol", "Currency symbol max length 2 characters.");
        }
    }
}
