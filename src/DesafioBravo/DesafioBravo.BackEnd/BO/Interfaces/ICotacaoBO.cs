using DesafioBravoBackEnd.DTO;

namespace DesafioBravoBackEnd.BO
{
    public interface ICotacaoBO
    {
        CotacaoDTO Buscar(string from, string to, string amount);
    }
}