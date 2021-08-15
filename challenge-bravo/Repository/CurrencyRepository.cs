using challenge_bravo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace challenge_bravo.Repository
{
    public class CurrencyRepository : ICurrencyRepository
    {

        private Models.Database Context = new Models.Database();

        public Convertion ConvertCurrency(Currency fromConvert , Currency ToConvert, decimal amount)
        {

            Convertion result = new Convertion();
            result.Amount = amount;
            result.ConvertedFrom = fromConvert.Base;
            result.ConvertedTo = ToConvert.Base;

            decimal LittleNumber = Convert.ToDecimal(0.01);


            /// Verificando se a conversões é de dolar para outra moeda
            if (fromConvert.Base.Equals("USD", StringComparison.OrdinalIgnoreCase))
            {
                if(ToConvert.Value > 0) 
                {
                    result.Value = amount * ToConvert.Value;
                }
                else
                {
                    result.Value = amount / ToConvert.Value;
                }
                
            }
            else
            {
                /// demais conversões de moedas
                if(fromConvert.Value < LittleNumber)
                {
                    result.Value = (amount * fromConvert.Value) * ToConvert.Value;
                   
                }
                else
                {
                    result.Value = (amount / fromConvert.Value) * ToConvert.Value;
                }
            };
            result.Value = Math.Round(result.Value, 5);
            return result;

        }

        public void DeleteCurrency(Currency currency)
        {
            /// deleta cotação
            Context.Currencys.Remove(currency);
            this.SaveChanges();
        }

        public IEnumerable<Currency> GetAllCurrency()
        {
            /// retorna todas as cotações
            return Context.Currencys.ToList();
        }

        public Currency GetCurrencyByBase(string cur)
        {
            /// busca uma cotação pela base Ex: "USD"
            return Context.Currencys.FirstOrDefault(c => c.Base.Equals(cur, StringComparison.OrdinalIgnoreCase));
        }

        public void PostCurrency(Currency currency)
        {
            /// salva nova cotação
            Context.Currencys.Add(currency);
            this.SaveChanges();
        }

        public void PutCurrency(Currency currency)
        {
            /// atualiza cotação
            Context.Entry(currency).State = System.Data.Entity.EntityState.Modified;
            this.SaveChanges();
        }

        public void SaveChanges()
        {
            Context.SaveChanges();
        }
    }
}