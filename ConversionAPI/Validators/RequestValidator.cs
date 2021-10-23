using CurrencyAPI.Models;
using System;

namespace CurrencyAPI.Validators
{
    public static class RequestValidator
    {
        // Validate expected fields for each request type
        public static bool CurrencyValidation(CurrencyBaseRequestObject request, out string errorMessage)
        {
            errorMessage = String.Empty;
            if (String.IsNullOrWhiteSpace(request.Name))
                errorMessage = "Could not find expected field with currency name";

            if (!String.IsNullOrWhiteSpace(errorMessage))
                return false;
            else
                return true;
        }

        public static bool CurrencyChangeValidation(CurrencyChangeObject request, out string errorMessage)
        {
            errorMessage = String.Empty;
            if (String.IsNullOrWhiteSpace(request.Name))
                errorMessage = "Could not find expected field with currency name";
            else if (request.RateValue <= 0)
                errorMessage = "Invalid amount received. Please use a positive value";

            if (!String.IsNullOrWhiteSpace(errorMessage))
                return false;
            else
                return true;
        }

        public static bool ConversionValidation(ConversionRequestObject request, out string errorMessage)
        {
            errorMessage = String.Empty;
            if (String.IsNullOrWhiteSpace(request.From) || String.IsNullOrWhiteSpace(request.To))
                errorMessage = "Could not find expected fields with currency information";
            else if (request.Amount <= 0)
                errorMessage = "Invalid amount received. Please use a positive value";

            if (!String.IsNullOrWhiteSpace(errorMessage))
                return false;
            else
                return true;
        }
    }
}
