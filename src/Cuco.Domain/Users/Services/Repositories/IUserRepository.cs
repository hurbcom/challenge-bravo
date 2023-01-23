using Cuco.Commons.Base;
using Cuco.Domain.Users.Models.DTO;
using Cuco.Domain.Users.Models.Entities;

namespace Cuco.Domain.Users.Services.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<UserDTO> GetUserDTO(string name, string password);
    Task<bool> DeleteByNameAsync(string name);
    Task<User> GetByNameAsync(string name);
}