namespace ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;

public class AutenticacaoViewModel
{
    /// <summary>
    ///     Token para autenticação referente ao Micro Service de Auth
    /// </summary>
    public string Usuario { get; set; }

    /// <summary>
    ///     Documento do usuário que está realizando o login para auditoria
    /// </summary>
    public string Senha { get; set; }
}