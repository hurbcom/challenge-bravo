namespace ConversaoMonetaria.Dominio.Core.Retornos;

/// <summary>
///     Essa classe tem o objetivo de fornecer um retorno mais completo de uma função
///     Ao realizar uma chamada para um Object podemos ter como resultado: Exception ou Object
/// </summary>
/// <typeparam name="TFalha"></typeparam>
/// <typeparam name="TSucesso"></typeparam>
///
/// TODO: Alterar no futuro para poder retornar uma lista de criticas.
public struct Retorno<TFalha, TSucesso>
{
    public TFalha Failure { get; }
    public TSucesso Result { get; }
    private bool _ehFalha { get; }
    public bool EhFalha()
    {
        return _ehFalha;
    }

    internal Retorno(TFalha falha)
    {
        _ehFalha = true;
        Failure = falha;
        Result = default;
    }

    internal Retorno(TSucesso sucesso)
    {
        _ehFalha = false;
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