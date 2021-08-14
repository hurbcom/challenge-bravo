using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.Authorization;
using ChallengeBravo.Controllers;

namespace ChallengeBravo.Web.Controllers
{
    [AbpMvcAuthorize]
    public class AboutController : ChallengeBravoControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}
