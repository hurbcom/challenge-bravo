using Cuco.Commons.Base;
using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Models.Entities;

namespace Cuco.Domain.Users.Services.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<UserInfo> GetUserInfo(string name, string hashedPassword);
}