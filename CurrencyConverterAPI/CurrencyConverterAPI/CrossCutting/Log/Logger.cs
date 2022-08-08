namespace CurrencyConverterAPI.CrossCutting.Log
{
    public static class Logger
    {
        public static void LoggerCallApi(ILogger logger, string nameClass, bool isSuccess, string nameMethod, string[] param, string result)
        {
            if (isSuccess)
                logger.LogInformation(MessageLog.Info(nameClass, nameMethod, param));
            else
                logger.LogError(MessageLog.Error(nameClass, nameMethod, result, param));
        }

        public static void LoggerClass(ILogger logger, string nameClass, bool hasError, string nameMethod, string? message = null, string[]? param = null)
        {
            if (hasError)
                logger.LogError(MessageLog.Error(nameClass, nameMethod, message, param));
            else
                logger.LogInformation(MessageLog.Info(nameClass, nameMethod, param, message));

        }
    }
}
