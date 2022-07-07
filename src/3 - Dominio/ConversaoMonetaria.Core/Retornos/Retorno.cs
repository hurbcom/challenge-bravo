namespace ConversaoMonetaria.Dominio.Core.Retornos;

/// <summary>
///     Essa classe tem o objetivo de fornecer um retorno mais completo de uma função
///     Ao realizar uma chamada para um Object podemos ter como resultado: Exception ou Object
/// </summary>
/// <typeparam name="TFalha"></typeparam>
/// <typeparam name="TSucesso"></typeparam>
public struct Retorno<TFalha, TSucesso>
{
    public TFalha Failure { get; }
    public TSucesso Result { get; }

    public bool EhFalha { get; }

    internal Retorno(TFalha falha)
    {
        EhFalha = true;
        Failure = falha;
        Result = default;
    }

    internal Retorno(TSucesso sucesso)
    {
        EhFalha = false;
        Failure = default;
        Result = sucesso;
    }

    public static implicit operator Retorno<TFalha, TSucesso>(TFalha falha)
    {
        return new Retorno<TFalha, TSucesso>(falha);
    }

    public static implicit operator Retorno<TFalha, TSucesso>(TSucesso sucesso)
    {
        return new Retorno<TFalha, TSucesso>(sucesso);
    }
}