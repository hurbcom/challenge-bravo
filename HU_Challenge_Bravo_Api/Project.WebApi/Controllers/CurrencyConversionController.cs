using AutoMapper;
using Project.Business.DTOs;
using Project.Business.Facades.Interface;
using Project.WebApi.ViewModels;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Project.WebApi.Controllers
{
    //ToDo: Refactoring - Review the name of the controlllers to be more legible/semantic (make more sense)
    [RoutePrefix("api/currencyConversion")]
    public class CurrencyConversionController : ApiController
    {
        private ICurrencyConversionFacade _currencyConversionFacade = null;

        public CurrencyConversionController(ICurrencyConversionFacade currencyConversionFacade)
        {
            _currencyConversionFacade = currencyConversionFacade;
        }

        #region ' API Testing Request to External API '

        [HttpGet]
        [Route("getCurrenciesQuotation/{currencySymbol}")]
        public async Task<HttpResponseMessage> GetCurrenciesQuotation([FromUri] string currencySymbol)
        {
            CurrencyDTO currencyData = null;

            try
            {
                currencyData = await _currencyConversionFacade.GetCurrencyQuotation(currencySymbol);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            var responseData = Mapper.Map<CurrencyDTO, CurrencyDataViewModel>(currencyData);

            return Request.CreateResponse(HttpStatusCode.OK, responseData);
        }

        #endregion

        [HttpGet]
        [Route("convert/from/{fromCurrency}/to/{toCurrency}/amount/{amount:decimal}")]
        public async Task<HttpResponseMessage> Convert([FromUri] string fromCurrency, string toCurrency, decimal amount)
        {
            decimal x = 0M;

            try
            {
                x = await _currencyConversionFacade.GetCurrencyConverted(fromCurrency.ToUpper(), toCurrency.ToUpper(), amount);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, x);
        }
    }
}
