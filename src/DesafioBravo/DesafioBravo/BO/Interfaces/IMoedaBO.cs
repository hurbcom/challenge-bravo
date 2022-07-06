using DesafioBravo.DTO;

namespace DesafioBravo.BO
{
    public interface IMoedaBO
    {
        MoedaDTO Adicionar(string codigo, decimal valorEmDolar);
        MoedasDTO Buscar();
        MoedaDTO Buscar(string codigo);
        MoedaDTO Remover(string codigo);
    }
}