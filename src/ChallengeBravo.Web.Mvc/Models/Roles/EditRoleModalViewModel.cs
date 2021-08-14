using Abp.AutoMapper;
using ChallengeBravo.Roles.Dto;
using ChallengeBravo.Web.Models.Common;

namespace ChallengeBravo.Web.Models.Roles
{
    [AutoMapFrom(typeof(GetRoleForEditOutput))]
    public class EditRoleModalViewModel : GetRoleForEditOutput, IPermissionsEditViewModel
    {
        public bool HasPermission(FlatPermissionDto permission)
        {
            return GrantedPermissionNames.Contains(permission.Name);
        }
    }
}
