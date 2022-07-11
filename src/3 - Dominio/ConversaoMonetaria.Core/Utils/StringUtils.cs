using System;

namespace ConversaoMonetaria.Dominio.Core.Utils;

public static class StringUtils
{
    public static string FormatDateTimeBrazil(this DateTime value)
    {
        return value.ToString("dd/MM/yyyy HH:mm:ss");
    }

    public static string FormatEx(this string aValue, params object[] aArgs)
    {
        if (aValue.IsNullOrWhiteSpace() || aArgs == null || aArgs.Length == 0)
            return aValue;

        return string.Format(aValue, aArgs);
    }

    private static bool IsNullOrWhiteSpace(this string aValue)
    {
        return string.IsNullOrWhiteSpace(aValue);
    }

    public static int ToInt(this string aString, int aDefault = 0)
    {
        return !int.TryParse(aString, out var result) ? aDefault : result;
    }
}