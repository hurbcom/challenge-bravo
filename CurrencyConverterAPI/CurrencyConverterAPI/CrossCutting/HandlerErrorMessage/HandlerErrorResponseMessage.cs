namespace CurrencyConverterAPI.CrossCutting.HandlerErrorMessage
{
    public sealed class HandlerErrorResponseMessage
    {
        public static string BadRequestAmountInvalid(string value)
        {
            return String.Format("The amount entered '{0}' is in invalid. Please use only numbers and '.' as a decimal separator.", value);
        }
        public static string NotFoundCurrencyUnavailable(string currency)
        {
            return String.Format("Sorry, the currency entered '{0}' is not available.", currency);
        }

        public static string Exception = "Sorry, there was a processing failure. Please try again.";

        public static string BadRequestParamFromIsRequired = "The 'from' attribute is mandatory.";

        public static string BadRequestParamToIsRequired = "The 'to' attribute is mandatory.";

        public static string BadRequestParamAmountIsRequired = "The 'amount' attribute is mandatory.";

        public static string ServiceUnavailableBrokenCircuit = "Sorry, we were unable to process your request. Please, try again in a few minutes.";

        public static string ServiceUnavailableExceededRetry = "Sorry, we were unable to process your request. Please, wait a minute and try again.";
    }
}
