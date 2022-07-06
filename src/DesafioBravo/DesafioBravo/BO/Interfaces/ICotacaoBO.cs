using DesafioBravo.DTO;

namespace DesafioBravo.BO
{
    public interface ICotacaoBO
    {
        CotacaoDTO Buscar(string from, string to, string amount);
    }
}