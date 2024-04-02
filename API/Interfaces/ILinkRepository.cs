using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILinkRepository
    {
        void Update(AppLink link);
        Task<bool> SaveAllAsync();
        Task<PagedList<LinkDto>> GetLinksAsync(LinkParams linkParams);
        Task<PagedList<LinkDto>> GetPersonalLinksAsync(LinkParams linkParams, string email);
        Task<bool> CreateLink(AppLink link);
        Task<LinkDto> GetLinkByShortCodeAsync(string shortLink);
        Task IncrementUsageCount(string shortLink);
        Task DeactivateExpiredLinks();
    }
}