using System.Collections.Generic;
using ChallengeBravo.Roles.Dto;

namespace ChallengeBravo.Web.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }
    }
}