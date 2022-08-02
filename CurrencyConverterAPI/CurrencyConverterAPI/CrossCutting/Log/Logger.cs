namespace CurrencyConverterAPI.CrossCutting.Log
{
    public static class Logger
    {
        public static void LoggerCallApi(ILogger logger, string nameClass, bool isSuccess, string nameMethod, string[] param, string result)
        {
            if (isSuccess)
                logger.LogInformation(MessageLog.Info(nameClass, nameMethod, param));
            else
                logger.LogInformation(MessageLog.Error(nameClass, nameMethod, result, param));
        }
    }
}
