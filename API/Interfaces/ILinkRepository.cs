using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ILinkRepository
    {
        void Update(AppLink link);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<LinkDto>> GetLinksAsync();
        Task<IEnumerable<LinkDto>> GetPersonalLinksAsync(string email);
        Task<bool> CreateLink(AppLink link);
        Task<LinkDto> GetLinkByShortCodeAsync(string shortLink);
        Task IncrementUsageCount(string shortLink);
        Task DeactivateExpiredLinks();
    }
}