using DesafioBravo.Data;
using DesafioBravo.DTO;
using DesafioBravo.Models;
using DesafioBravo.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace DesafioBravo.BO
{
    public class MoedaBO : IMoedaBO
    {
        AppDbContext context = null;
        List<string> moedasDesafio = new List<string> { "USD", "BRL", "EUR", "BTC", "ETH" };

        public MoedaBO(AppDbContext context)
        {
            this.context = context;
        }

        public MoedaDTO Buscar(string codigo)
        {
            MoedaDTO moedaDTO = new MoedaDTO();
            try
            {
                Moeda moeda = new MoedaDAO().Buscar(context, codigo);
                if (moeda != null)
                    MontarMoedaDTO(ref moedaDTO, moeda);
                else
                    MontarMoedaDTO(ref moedaDTO, null, false, $"Moeda {codigo} não encontrada.");
            }
            catch (Exception ex)
            {
                MontarMoedaDTO(ref moedaDTO, null, false, ex.Message);
            }
            return moedaDTO;
        }

        public MoedasDTO Buscar()
        {
            MoedasDTO moedaDTO = new MoedasDTO();
            try
            {
                List<Moeda> moedas = new MoedaDAO().BuscarTodas(context);
                if (moedas != null)
                    MontarMoedasDTO(ref moedaDTO, moedas);
                else
                    MontarMoedasDTO(ref moedaDTO, null, false, $"Moedas não encontradas.");
            }
            catch (Exception ex)
            {
                MontarMoedasDTO(ref moedaDTO, null, false, ex.Message);
            }
            return moedaDTO;
        }

        public void Adicionar(Moeda moeda)
        {
            moeda = Adicionar(new MoedaViewModel()
            {
                Codigo = moeda.Codigo,
                ValorEmDolar = moeda.ValorEmDolar
            })
            .moeda;
        }

        public MoedaDTO Adicionar(MoedaViewModel model)
        {
            MoedaDTO moedaDTO = new MoedaDTO();
            try
            {
                Moeda moeda = new MoedaDAO().Adicionar(context, model);

                if (moeda != null)
                    MontarMoedaDTO(ref moedaDTO, moeda);
                else
                    MontarMoedaDTO(ref moedaDTO, null, false, "Não foi possível adicionar a moeda.");


            }
            catch (Exception ex)
            {
                MontarMoedaDTO(ref moedaDTO, null, false, ex.Message);
            }
            return moedaDTO;

        }

        public MoedaDTO Remover(string codigo)
        {
            MoedaDTO moedaDTO = new MoedaDTO();
            try
            {
                new MoedaDAO().Remover(context, codigo);
                moedaDTO.retorno = new RetornoDTO() { sucesso = true, mensagem = string.Empty };
            }
            catch (Exception ex)
            {
                MontarMoedaDTO(ref moedaDTO, null, false, $"Não foi possível remover a moeda {codigo}: " + ex.Message);
            }
            return moedaDTO;
        }

        private static void MontarMoedaDTO(ref MoedaDTO moedaDTO, Moeda moeda, bool sucesso = true, string mensagem = null)
        {
            moedaDTO.moeda = moeda;

            moedaDTO.retorno = new RetornoDTO()
            {
                sucesso = sucesso,
                mensagem = mensagem
            };
        }

        private static void MontarMoedasDTO(ref MoedasDTO moedaDTO, List<Moeda> moedas, bool sucesso = true, string mensagem = null)
        {
            moedaDTO.moedas = moedas;

            moedaDTO.retorno = new RetornoDTO()
            {
                sucesso = sucesso,
                mensagem = mensagem
            };
        }

        private void RemoverTodas()
        {
            try
            {
                MoedasDTO moedasDTO = Buscar();

                foreach (var item in moedasDTO.moedas)
                {
                    new MoedaDAO().Remover(context, item.Codigo);
                }
            }
            catch (Exception)
            {
            }
        }

        public void DadosIniciais()
        {
            RemoverTodas();

            JObject joResponse = JObject.Parse(new CotacaoBO(context).BuscarCotacoesWebService());

            foreach (JToken item in joResponse["rates"])
            {
                if (item != null)
                {
                    string codigoMoeda = ((JProperty)item).Name;

                    if (moedasDesafio.Contains(codigoMoeda.Trim()))
                    {
                        Adicionar
                            (
                                new Moeda()
                                {
                                    Codigo = codigoMoeda,
                                    ValorEmDolar = Convert.ToDecimal(((JProperty)item).Value),
                                    Data = DateTime.Now
                                }
                            );
                    }
                }
            }
        }
    }
}