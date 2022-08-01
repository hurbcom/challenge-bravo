namespace CurrencyConverterAPI.Helper.Log
{
    public static class MessageLog
    {
        public static string InfoController(string controllerName, string? actionName, string[]? param = null)
        {
            return String.Format("[{0}] Call method '{1}' with params: {2}", controllerName, actionName, (param != null ? string.Join(", ", param) : ""));
        }

        public static string ErrorController(string controllerName, string? actionName, string message)
        {
            return String.Format("[{0}] Call method '{1}' generated an error: {2}", controllerName, actionName, message);
        }
    }
}