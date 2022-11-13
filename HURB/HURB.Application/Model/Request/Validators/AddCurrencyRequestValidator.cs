using Flunt.Validations;
using HURB.Application.Model.Request.Currency;

namespace HURB.Application.Model.Request.Validators
{
    public class AddCurrencyRequestValidator : Contract<AddCurrencyRequest>
    {
        public AddCurrencyRequestValidator(AddCurrencyRequest model)
        {
            Requires().IsNotNullOrWhiteSpace(model.ISOCurrencySymbol, "ISO Symbol", "ISO Symbol required.");
        }
    }
}
