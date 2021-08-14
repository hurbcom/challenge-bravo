using System.Threading.Tasks;
using ChallengeBravo.Models.TokenAuth;
using ChallengeBravo.Web.Controllers;
using Shouldly;
using Xunit;

namespace ChallengeBravo.Web.Tests.Controllers
{
    public class HomeController_Tests: ChallengeBravoWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}