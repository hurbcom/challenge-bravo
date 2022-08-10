namespace CurrencyConverterAPI.CrossCutting.HandlerErrorMessage
{
    public sealed class HandlerErrorResponseMessage
    {
        public static string BadRequestAmountInvalid(string value)
        {
            return String.Format("The amount entered '{0}' is in invalid. Please use only numbers and '.' as a decimal separator.", value);
        }
        public static string NotFoundCoinNotAvailable(string coin)
        {
            return String.Format("Sorry, the coin entered '{0}' is not available.", coin);
        }

        public static string Exception = "Sorry, there was a processing failure. Please try again.";

        public static string BadRequestParamFromIsRequired = "The 'from' attribute is mandatory.";

        public static string BadRequestParamToIsRequired = "The 'to' attribute is mandatory.";

        public static string BadRequestParamAmountIsRequired = "The 'amount' attribute is mandatory.";

        public static string ServiceUnavailableBrokenCircuit = "Sorry, we were unable to process your request. Please, try again in a few minutes.";

        public static string ServiceUnavailableExceededRetry = "Sorry, we were unable to process your request. Please, wait a minute and try again.";

        public static string NotFoundCoin = "Coin not found.";

        public static string BadRequestCoin = "Invalid coin. Check the fields as they are all required.";

        public static string BadRequestNameCoinInputRequiredField = "The 'name' field is required.";

        public static string BadRequestAcronymCoinInputRequiredField = "The 'iniitials' field is required.";

        public static string BadRequestNameCoinInputRangeLenghtField = "The size of the 'name' field is invalid. Must contain between 4 and 64 characters.";

        public static string BadRequestAcronymCoinInputLenghtField = "The size of the 'initials' field is invalid. Must contain 3 characters.";

        public static string BadRequestPriceCoinInputLenghtField = "The 'price' field is mandatory and must have a value greater than zero.";

        public static string BadRequestCoinExistInDB = "A coin with the same acronym already exists at the base. Please, check it out.";
    }
}
