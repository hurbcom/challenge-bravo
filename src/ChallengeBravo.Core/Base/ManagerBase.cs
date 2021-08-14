using Abp.Domain.Entities.Auditing;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.UI;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ChallengeBravo.Base
{
    public class ManagerBase<TEntidade> : DomainService, IManagerBase<TEntidade>
        where TEntidade : FullAuditedEntity<Guid>
    {
        private readonly IRepository<TEntidade, Guid> _repository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ManagerBase(IRepository<TEntidade, Guid> repository, IUnitOfWorkManager unitOfWorkManager)
        {
            _repository = repository;
            _unitOfWorkManager = unitOfWorkManager;

        }

        public void Inserir(TEntidade entidade)
        {
            _repository.Insert(entidade);
        }

        public void Atualizar(TEntidade entidade)
        {
            _repository.Update(entidade);
        }

        public TEntidade ObterPorId(Guid guid)
        {
            return _repository.FirstOrDefault(var => var.Id == guid);
        }

        public List<TEntidade> ObterTodos()
        {
            return _repository.GetAllList();

        }

        public void ApgarPorId(Guid guid)
        {
            using (var unitofWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    _repository.HardDelete(var => var.Id == guid);
                }
                catch (Exception e)
                {
                    throw new UserFriendlyException(e.Message);
                }

                unitofWork.Complete();
            }

            
        }

    }
}
