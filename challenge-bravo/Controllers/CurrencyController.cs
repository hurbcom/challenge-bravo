using challenge_bravo.Models;
using challenge_bravo.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace challenge_bravo.Controllers
{
    public class CurrencyController : ApiController
    {
        private ICurrencyRepository _repository;
        private Utils Utils;

        public CurrencyController(CurrencyRepository repository, Utils utils)
        {
            this._repository = repository;
            Utils = utils;
        }

        [HttpGet]
        //// GET
        //// api/currency?from=USD&To=EUR&amount=100

        public async Task<Convertion> GetConvertion(string from, string to, decimal amount)
        {
            /// verificando se as moedas já estão cadastradas
            Currency usd = _repository.GetCurrencyByBase("usd");

            if (usd == null)
            {
                await Utils.SavingInitialValues();
            }

            /// buscando no db as duas cotações a serem convertidas
            Currency CurrencyOne = _repository.GetCurrencyByBase(from);
            Currency CurrencyTwo = _repository.GetCurrencyByBase(to);


            if (CurrencyOne == null || CurrencyTwo == null)
            {
                return null;
            }

            var Result = _repository.ConvertCurrency(CurrencyOne, CurrencyTwo, amount);

            return Result;

        }

        [HttpGet]
        ///GET
        ///Retorna todas as moedas
        public IEnumerable<Currency> GetCurrencyList()
        {
            /// retornando todas as cotações salvas no DB
            return _repository.GetAllCurrency();
        }

        [HttpPost]
        /// POST
        /// com body {Base: "USD", value: 0.000}
        public IHttpActionResult PostCurrency([FromBody]Currency NewCurrency)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Formato invalido");
            }

            try
            {
                _repository.PostCurrency(NewCurrency);
            }
            catch (Exception err)
            {
                throw err;
            }
            return CreatedAtRoute("DefaultApi", new { id = NewCurrency.Id }, NewCurrency);
        }

        [HttpPut]
        /// PUT
        /// /api/currency?cur=USD body {Base: "USD", value: 0.000}
        public IHttpActionResult putCurrency(string cur, Currency Currency)
        {
            Currency CurrencyBeforeUpdate = _repository.GetCurrencyByBase(cur);
            CurrencyBeforeUpdate.Value = Currency.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest("Formato invalido");
            }

            if (CurrencyBeforeUpdate == null)
            {
                return NotFound();
            }

            try
            {
                _repository.PutCurrency(CurrencyBeforeUpdate);
            }
            catch (Exception err)
            {
                throw err;
            }
            return CreatedAtRoute("DefaultApi", new { id = CurrencyBeforeUpdate.Id }, Currency);
        }

        [HttpDelete]
        ///DELETE
        /// /api/currency?cur=USD
        public IHttpActionResult DeleteCurrency(string cur)
        {
            Currency curr = _repository.GetCurrencyByBase(cur);
            if (cur == null)
            {
                return NotFound();
            }

            try
            {
                _repository.DeleteCurrency(curr);
            }
            catch
            {
                throw;
            }

            return Ok(cur);
        }
    }
}
