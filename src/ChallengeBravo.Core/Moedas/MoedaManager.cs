using Abp.Domain.Repositories;
using Abp.UI;
using System;
using ChallengeBravo.Base;
using Abp.Domain.Uow;

namespace ChallengeBravo.Moedas
{
    public class MoedaManager : ManagerBase<Moeda>, IMoedaManager
    {
        private readonly IRepository<Moeda, Guid> _repository;

        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public MoedaManager(IRepository<Moeda, Guid> repository, IUnitOfWorkManager unitOfWorkManager) : base(repository, unitOfWorkManager)
        {
            _repository = repository;
        }

        public Guid ObterIdPorCodigo(string codigo)
        {
            var retorno = _repository.FirstOrDefault(var => var.Codigo == codigo);

            if(retorno == null)
            {
                return Guid.Empty;
            }
            else
            {
                return retorno.Id;
            }
        }

        public void ApagarPorCodigo(string codigo)
        {
            var idMoeda = ObterIdPorCodigo(codigo);

            ApgarPorId(idMoeda);
        }

        public float ConverterMoedas(string codigoOrigem, string codigoDestino, float valorOrigem)
        {

            //Se a moeda de origem e/ou destino forem iguais a nulo.

            if (codigoOrigem.ToUpper() == null || codigoDestino.ToUpper() == null)
            {
                throw new UserFriendlyException("As entradas são inválidas");
            }
            else
            {
                //Se valor for igual a zero, não é necessária a conversão. Então a aplicação retornará zero.

                if(valorOrigem == 0.0)
                {
                    return valorOrigem;
                }
                else
                {
                    //A conversão de moedas só ocorrerá se o valor for positivo.

                    if(valorOrigem < 0.0)
                    {
                        throw new UserFriendlyException("O valor precisa ser maior que ou igual a 0.");
                    }
                    else
                    {
                        //Se a moeda de origem e/ou destino forem iguais.

                        if (codigoOrigem.ToUpper() == codigoDestino.ToUpper())
                        {
                            return valorOrigem;
                        }
                        else
                        {
                            //Busca dos registros nas bases de dados.

                            var consultaDaCotacaoOrigem = _repository.FirstOrDefault(var => var.Codigo == codigoOrigem);

                            var consultaDaCotacaoDestino = _repository.FirstOrDefault(var => var.Codigo == codigoDestino);

                            //As cotações deverão estar cadastradas na base de dados.

                            if (consultaDaCotacaoOrigem != null && consultaDaCotacaoDestino != null)
                            {
                                return (float)Math.Round((valorOrigem * consultaDaCotacaoOrigem.ValorUSD) / consultaDaCotacaoDestino.ValorUSD, 2);
                            }
                            else
                            {
                                //Condições abaixo informam ao usuário sobre as cotações não cadastradas na base de dados.

                                if (consultaDaCotacaoOrigem == null && consultaDaCotacaoDestino == null)
                                {
                                    throw new UserFriendlyException("As moedas " + codigoOrigem + " e " + codigoDestino + " não foram encontradas.");
                                }
                                else
                                {
                                    if (consultaDaCotacaoOrigem == null)
                                    {
                                        throw new UserFriendlyException("A moeda " + codigoOrigem + " não foi encontrada.");
                                    }
                                    else
                                    {
                                        throw new UserFriendlyException("A moeda " + codigoDestino + " não foi encontrada.");
                                    }

                                }
                            }


                        }
                    }
                }
            }

        }
    }
}
