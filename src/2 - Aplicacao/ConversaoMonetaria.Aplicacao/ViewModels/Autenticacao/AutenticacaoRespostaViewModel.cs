using ConversaoMonetaria.Dominio.Core.Retornos.RetornosPadrao;

namespace ConversaoMonetaria.Aplicacao.ViewModels.Autenticacao;

public class AutenticacaoRespostaViewModel
{
    public ResultadoSucessoPadraoViewModel Resultado { get; set; } = new();
    public string Token { get; set; }

    public string Usuario { get; set; }

    public string Senha { get; set; }
    public string DataExpiracao { get; set; }
}