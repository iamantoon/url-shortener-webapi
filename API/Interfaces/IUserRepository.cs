using API.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByEmailAsync(string email);
        Task<EntityEntry<AppUser>> CreateUserAsync(AppUser user);
    }
}