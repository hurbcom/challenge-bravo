using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities.Auditing;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;

namespace ChallengeBravo.Base
{
    public abstract class AppServiceBase<TEntidade, TInputDto, TOutputDto> : ApplicationService
        where TEntidade : FullAuditedEntity<Guid>
        where TInputDto : EntityDto
        where TOutputDto : EntityDto<Guid>
    {
        private readonly IManagerBase<TEntidade> _manager;

        public AppServiceBase(IManagerBase<TEntidade> manager)
        {
            _manager = manager;
        }

        public void Inserir(TInputDto objeto)
        {
            var entidade = ObjectMapper.Map<TEntidade>(objeto);
            _manager.Inserir(entidade);
        }

        public TOutputDto ObterPorId(Guid guid)
        {
            var retorno = _manager.ObterPorId(guid);
            if (retorno == null)
                throw new UserFriendlyException(ObterMensagemNaoEncontrado());

            return ObjectMapper.Map<TOutputDto>(retorno);
        }

        public List<TOutputDto> ObterTodos()
        {
            var retorno = _manager.ObterTodos();
            return ObjectMapper.Map<List<TOutputDto>>(retorno);
        }

        [HttpDelete]
        public void ApgarPorId(Guid guid)
        {
            _manager.ApgarPorId(guid);
        }


        public abstract string ObterMensagemNaoEncontrado();
    }
}
