using System;

namespace ConversaoMonetaria.Dominio.Core.Utils;

public static class ObjectUtils
{
    public static void CopiarTodasAsPropriedadesPara<T,TR>(this T source, TR target)
    {
        var typeSource = typeof(T);
        var typeTarget = typeof(TR);
        foreach (var sourceProperty in typeSource.GetProperties())
        {
            if (sourceProperty.Name.Equals("Id"))
                continue;

            var targetProperty = typeTarget.GetProperty(sourceProperty.Name);

            if (targetProperty != null)
                targetProperty.SetValue(target, sourceProperty.GetValue(source, null), null);
        }
        foreach (var sourceField in typeSource.GetFields())
        {
            if (sourceField.Name.Equals("Id"))
                continue;

            var targetField = typeTarget.GetField(sourceField.Name);
            if (targetField != null)
                targetField.SetValue(target, sourceField.GetValue(source));
        }
    }
}