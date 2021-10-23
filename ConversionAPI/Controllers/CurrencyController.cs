using CurrencyAPI.Models;
using CurrencyAPI.Validators;
using Microsoft.AspNetCore.Mvc;
using SharedLibrary;
using SharedLibrary.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConversionAPI.Controllers
{
    public class CurrencyController : Controller
    {
        private SQLLiteDbContext _dbContext;

        public CurrencyController(SQLLiteDbContext liteDbContext)
        {
            _dbContext = liteDbContext;
        }

        [HttpPost]
        [ApiKey]
        [Route("api/CreateCurrency")]
        public async Task<BaseResponseObject> CreateCurrency([FromBody] CurrencyChangeObject request)
        {
            BaseResponseObject response = new BaseResponseObject();

            string errorMessage = String.Empty;
            if (!RequestValidator.CurrencyChangeValidation(request, out errorMessage))
            {
                response.Success    = false;
                response.Status     = errorMessage;
                return response;
            }

            if(await _dbContext.FindOne(request.Name) != null)
            {
                response.Success    = false;
                response.Status     = String.Format("Currency '{0}' already exists. If you want to make any changes please use the update option", request.Name);
                return response;
            }

            CurrencyObject newCurrency  = new CurrencyObject();
            newCurrency.Name            = request.Name;
            newCurrency.Price           = request.PriceValue;
            newCurrency.AutoUpdatePrice = request.AutoUpdatePrice;

            // In this case we need to convert the given price value to the default currency
            if(!String.IsNullOrEmpty(request.PriceCurrency) && request.PriceCurrency != "USD")
            {
                CurrencyObject priceCurrency = await _dbContext.FindOne(request.PriceCurrency);
                if(priceCurrency == null)
                {
                    response.Success    = false;
                    response.Status     = String.Format("Could not found price currency '{0}'. Please change the currency used or add it first", request.Name);
                    return response;
                }

                newCurrency.Price   = priceCurrency.Price * request.PriceValue;
            }

            if(await _dbContext.Insert(newCurrency))
            {
                response.Success        = true;
                response.Status         = String.Format("Added new currency '{0}' to collection", request.Name);
            }
            else
            {
                response.Success        = false;
                response.Status         = String.Format("Could not insert new currency '{0}' to collection", request.Name);
            }

            return response;
        }

        [HttpPut]
        [ApiKey]
        [Route("api/UpdateCurrency")]
        public async Task<BaseResponseObject> UpdateCurrency([FromBody] CurrencyChangeObject request)
        {
            BaseResponseObject response = new BaseResponseObject();

            string errorMessage = String.Empty;
            if (!RequestValidator.CurrencyChangeValidation(request, out errorMessage))
            {
                response.Success    = false;
                response.Status     = errorMessage;
                return response;
            }

            CurrencyObject foundCurrency = await _dbContext.FindOne(request.Name);
            if(foundCurrency == null)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not find currency '{0}' to update. If you want to insert a new one, please use the insert option", request.Name);
                return response;
            }
            else if (foundCurrency.DefaultCurrency)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not update currency '{0}' on collection. It is registered as a default coin and its information can not be changed", request.Name);
                return response;
            }

            CurrencyObject newCurrency      = new CurrencyObject();
            newCurrency.Name                = request.Name;
            newCurrency.Price               = request.PriceValue;
            newCurrency.AutoUpdatePrice     = request.AutoUpdatePrice;

            // In this case we need to convert the given price value to the default currency
            if(!String.IsNullOrEmpty(request.PriceCurrency) && request.PriceCurrency != "USD")
            {
                CurrencyObject priceCurrency = await _dbContext.FindOne(request.PriceCurrency);
                if(priceCurrency == null)
                {
                    response.Success    = false;
                    response.Status     = String.Format("Could not found price currency '{0}'. Please change the currency used or add it first", request.PriceCurrency);
                    return response;
                }

                newCurrency.Price   = priceCurrency.Price * request.PriceValue;
            }

            if (await _dbContext.Update(newCurrency))
            {
                response.Success    = true;
                response.Status     = String.Format("Updated information for currency '{0}' on collection", request.Name);
            }
            else
            {
                response.Success    = false;
                response.Status     = String.Format("Could not update currency '{0}' on collection", request.Name);
            }

            return response;
        }

        [HttpGet]
        [ApiKey]
        [Route("api/GetCurrency")]
        public async Task<CurrencyResponseObject> GetCurrency([FromQuery] CurrencyBaseRequestObject request)
        {
            CurrencyResponseObject response = new CurrencyResponseObject();

            string errorMessage = String.Empty;
            if (!RequestValidator.CurrencyValidation(request, out errorMessage))
            {
                response.Success    = false;
                response.Status     = errorMessage;
                return response;
            }

            CurrencyObject currency = await _dbContext.FindOne(request.Name);
            if (currency != null)
            {
                response.Name               = currency.Name;
                response.PriceValue         = currency.Price;
                response.AutoUpdatePrice    = currency.AutoUpdatePrice;

                response.Success            = true;
                response.Status             = "Found currency information";                
            }
            else
            {
                response.Success            = false;
                response.Status             = String.Format("Could not find any information for currency '{0}'", request.Name);
            }

            return response;
        }

        [HttpDelete]
        [ApiKey]
        [Route("api/DeleteCurrency")]
        public async Task<BaseResponseObject> DeleteCurrency([FromBody] CurrencyBaseRequestObject request)
        {
            BaseResponseObject response = new BaseResponseObject();

            string errorMessage = String.Empty;
            if (!RequestValidator.CurrencyValidation(request, out errorMessage))
            {
                response.Success = false;
                response.Status = errorMessage;
                return response;
            }

            CurrencyObject currency = await _dbContext.FindOne(request.Name);
            if (currency == null)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not find currency '{0}' to delete", request.Name);
                return response;
            }
            else if (currency.DefaultCurrency)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not delete currency '{0}' on collection. It is registered as a default coin and its information can not be deleted", request.Name);
                return response;
            }
            
            if (await _dbContext.Delete(currency.Name))
            {
                response.Success    = true;
                response.Status     = String.Format("Deleted currency '{0}' from collection", request.Name);
            }
            else
            {
                response.Success    = false;
                response.Status     = String.Format("Could not delete currency '{0}' from collection", request.Name);
            }

            return response;
        }

        [HttpGet]
        [ApiKey]
        [Route("api/ListCurrencies")]
        public async Task<ListCurrenciesResponseObject> ListCurrencies()
        {
            ListCurrenciesResponseObject response = new ListCurrenciesResponseObject();

            IEnumerable<CurrencyObject> currencies = await _dbContext.FindAll();
            if(currencies == null)
            {
                response.Success    = false;
                response.Status     = String.Format("Could not get list of available currencies");
                return response;
            }

            response.Currencies     = new List<ListCurrencyObject>();
            foreach(CurrencyObject currency in currencies)
            {
                ListCurrencyObject newListCurrency  = new ListCurrencyObject();
                newListCurrency.Name                = currency.Name;
                newListCurrency.PriceValue          = currency.Price;
                newListCurrency.AutoUpdatePrice     = currency.AutoUpdatePrice;

                response.Currencies.Add(newListCurrency);
            }

            response.Success    = true;
            response.Status     = "Returning list of available currencies";
            
            return response;
        }
    }
}


