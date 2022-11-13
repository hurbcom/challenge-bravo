using Flunt.Validations;
using HURB.Application.Model.Request.Currency;

namespace HURB.Application.Model.Request.Validators
{
    public class UpdateCurrencyRequestValidator : Contract<UpdateCurrencyRequest>
    {
        public UpdateCurrencyRequestValidator(UpdateCurrencyRequest model)
        {
            Requires().AreNotEquals(model.Id, Guid.Empty, "Currency Id", "Currency Id required.");
            Requires().IsNotNullOrWhiteSpace(model.ISOCurrencySymbol, "ISO Symbol", "ISO Symbol required.");
        }
    }
}
