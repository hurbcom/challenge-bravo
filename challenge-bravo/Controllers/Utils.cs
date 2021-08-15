using challenge_bravo.Models;
using challenge_bravo.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace challenge_bravo.Controllers
{
    public class Utils
    {

        private ICurrencyRepository _repository;

        public Utils(CurrencyRepository repository)
        {
            this._repository = repository;
        }

        public async Task<Boolean> SavingInitialValues()
        {

            ApiCurrency Datas = new ApiCurrency();

            ///chamando api com cotações atualizadas
        
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json");
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(client.BaseAddress.ToString());

                if (response.IsSuccessStatusCode)
                {
                    var Content = response.Content.ReadAsStringAsync().Result;
                    Datas = JsonConvert.DeserializeObject<ApiCurrency>(Content);
                }

            }
            try { 
            /// salvando moedas no banco
                Currency Usd = new Currency();
                Usd.Base = "USD";
                Usd.Value = 1;
                PostCurrency(Usd);

                Currency btc = new Currency();
                btc.Base = "BTC";
                btc.Value = (1 / Datas.Usd.btc);
                PostCurrency(btc);

                Currency brl = new Currency();
                brl.Base = "BRL";
                brl.Value = Datas.Usd.brl;
                PostCurrency(brl);

                Currency eur = new Currency();
                eur.Base = "EUR";
                eur.Value = Datas.Usd.eur;
                PostCurrency(eur);

                Currency eth = new Currency();
                eth.Base = "ETH";
                eth.Value = (1 / Datas.Usd.eth);
                PostCurrency(eth);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private void PostCurrency(Currency NewCurrency)
        {
            _repository.PostCurrency(NewCurrency);
        }
    }
}