using Abp.Domain.Entities.Auditing;
using Abp.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChallengeBravo.Base
{
    public interface IManagerBase<TEntidade> : IDomainService
       where TEntidade : FullAuditedEntity<Guid>
    {
        TEntidade ObterPorId(Guid guid);

        List<TEntidade> ObterTodos();

        void Inserir(TEntidade entidade);

        void Atualizar(TEntidade entidade);

        void ApgarPorId(Guid guid);

    }
}
