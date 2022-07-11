namespace ConversaoMonetaria.Dominio.Core.Retornos.RetornosPadrao;

public class ResultadoSucessoPadraoViewModel
{
    public ResultadoSucessoPadraoViewModel()
    {
        CodigoMensagem = 100;
        Mensagem = "Realizado com sucesso";
    }

    /// <summary>
    ///     Código de identificação da mensagem
    /// </summary>
    public int CodigoMensagem { get; set; }

    /// <summary>
    ///     Mensagem de Retorno
    /// </summary>
    public string Mensagem { get; set; }
}