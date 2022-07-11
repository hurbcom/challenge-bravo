namespace ConversaoMonetaria.Dominio.Autenticacao;

public class ExpiracaoAutenticacao
{
    private int MinutosExpiracao { get; set; }

    public int TempoExpiracaoAutenticacaoMinutos
    {
        get => MinutosExpiracao == 0 ? 60 : MinutosExpiracao;
        set => MinutosExpiracao = value;
    }
}