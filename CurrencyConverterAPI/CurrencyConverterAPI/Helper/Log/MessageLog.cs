namespace CurrencyConverterAPI.Helper.Log
{
    public static class MessageLog
    {
        public static string InfoController(string controllerName, string actionName, string[]? param = null)
        {
            return String.Format("[{0}] Call method '{1}' with params: {2}", controllerName, actionName, (param != null ? string.Join(", ", param) : ""));
        }
    }
}
