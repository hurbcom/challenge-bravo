using DesafioBravo.DTO;
using DesafioBravo.Models;

namespace DesafioBravo.BO
{
    public interface IMoedaBO
    {
        void Adicionar(Moeda moeda);
        MoedasDTO Buscar();
        MoedaDTO Buscar(string codigo);
        MoedaDTO Remover(string codigo);
    }
}