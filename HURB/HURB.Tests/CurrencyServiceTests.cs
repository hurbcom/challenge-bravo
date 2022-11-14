using HURB.Core;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Services;
using Moq;

namespace HURB.Tests
{
    public class CurrencyServiceTests
    {
        private readonly DomainNotification _notification = new();
        private readonly Mock<ICurrencyRepository> _mockClientRepository = new();

        private CurrencyService GetClientService()
        {
            return new(_mockClientRepository.Object,
                       _notification);
        }

        [Fact]
        public async Task Insert_Currency_Valid()
        {
            _mockClientRepository
                .Setup(x => x.InsertAsync(It.IsAny<Currency>()))
                .ReturnsAsync(new Currency());

            var service = GetClientService();

            await service.AddAsync(new());

            Assert.False(_notification.HasNotifications);
            _mockClientRepository.Verify(x => x.InsertAsync(It.IsAny<Currency>()), Times.Once);
        }
    }
}