namespace CurrencyConverterAPI.CrossCutting.Log
{
    public static class MessageLog
    {
        public static string Info(string className, string? methodName, string[]? param = null)
        {
            return String.Format("[{0}] Call method '{1}' with params: {2}", className, methodName, (param != null ? string.Join(", ", param) : ""));
        }

        public static string Error(string className, string? methodName, string message, string[]? param = null)
        {
            return String.Format("[{0}] Call method '{1}' generated an error message: {2} with params: {3}", className, methodName, message, (param != null ? string.Join(", ", param) : ""));
        }
    }
}