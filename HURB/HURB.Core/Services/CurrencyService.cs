using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Interfaces.Services;

namespace HURB.Core.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _repository;
        private readonly DomainNotification _notification;

        public CurrencyService(ICurrencyRepository repository, DomainNotification notification)
        {
            _repository = repository;
            _notification = notification;
        }

        public async Task AddAsync(Currency entity)
        {
            if (!IsValidAdd(entity))
                return;

            await _repository.OpenTransactionAsync();
            await _repository.InsertAsync(entity);
            await _repository.CommitAsync();
        }

        public async Task<Currency> UpdateAsync(Currency entity)
        {
            if (!IsValidUpdate(entity))
                return await Task.FromResult(entity);

            await _repository.OpenTransactionAsync();
            await _repository.UpdateAsync(entity);
            await _repository.CommitAsync();

            return await Task.FromResult(entity);
        }

        #region PRIVATE METHODS

        private bool IsValidAdd(Currency entity)
        {
            bool isValid = true;
            ValidateIfExists(entity.ISOCurrencySymbol, ref isValid);

            return isValid;
        }

        private bool IsValidUpdate(Currency entity)
        {
            bool isValid = true;
            ValidateIfExists(entity.Id, entity.ISOCurrencySymbol, isValid);

            return isValid;
        }

        private void ValidateIfExists(string ISOCurrencySymbol, ref bool isValid)
        {
            var currencyAny = _repository.AnyAsync(x => x.ISOCurrencySymbol.ToLower() == ISOCurrencySymbol.ToLower());
            if (currencyAny.Result)
            {
                _notification.AddNotification("Currency registred", "The currency has already been registered.");
                isValid = false;
            }
        }

        private void ValidateIfExists(Guid id, string ISOCurrencySymbol, bool isValid)
        {
            var currencyAny = _repository.AnyAsync(x => x.Id != id && x.ISOCurrencySymbol.ToLower() == ISOCurrencySymbol.ToLower());
            if (currencyAny.Result)
            {
                _notification.AddNotification("Currency registred", "The currency has already been registered.");
                isValid = false;
            }
        }

        #endregion
    }
}
