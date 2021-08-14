using ChallengeBravo.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChallengeBravo.Moedas
{
    public interface IMoedaManager : IManagerBase<Moeda>
    {
        Guid ObterIdPorCodigo(string codigo);

        float ConverterMoedas(string codigoOrigem, string codigoDestino, float valorOrigem);

        void ApagarPorCodigo(string codigo);
    }
}
