using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LinkRepository : ILinkRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public LinkRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PagedList<LinkDto>> GetLinksAsync(LinkParams linkParams)
        {
            var query = _context.Links.AsQueryable();

            var maxExpiryDate = DateTime.Now.AddHours(linkParams.MaxExpiryDate);

            query = query.Where(l => l.ExpiryDate <= maxExpiryDate); 
            query = query.Where(l => l.Active != false);

            query = linkParams.OrderBy switch
            {
                "oldest" => query.OrderBy(link => link.Created),
                "popular" => query.OrderByDescending(link => link.UsageCount),
                _ => query.OrderByDescending(link => link.Created)
            };
            
            return await PagedList<LinkDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<LinkDto>(_mapper.ConfigurationProvider), 
                linkParams.PageNumber, 
                linkParams.PageSize
            );    
        }

        public async Task<PagedList<LinkDto>> GetPersonalLinksAsync(LinkParams linkParams, string email)
        {
            var query = _context.Links.AsQueryable();

            var maxExpiryDate = DateTime.Now.AddHours(linkParams.MaxExpiryDate);
            
            query = query.Where(u => u.AppUser.Email == email);
            if (!linkParams.All) query = query.Where(l => l.Active != false);
            query = query.Where(l => l.ExpiryDate <= maxExpiryDate);

            query = linkParams.OrderBy switch
            {
                "oldest" => query.OrderBy(link => link.Created),
                "popular" => query.OrderByDescending(link => link.UsageCount),
                _ => query.OrderByDescending(link => link.Created)
            };

            return await PagedList<LinkDto>.CreateAsync(
                query.ProjectTo<LinkDto>(_mapper.ConfigurationProvider).AsNoTracking(),
                linkParams.PageNumber, 
                linkParams.PageSize
            );
                
        }

        public async Task<bool> CreateLink(AppLink link)
        {
            _context.Links.Add(link);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<LinkDto> GetLinkByShortCodeAsync(string shortLink)
        {
            return await _context.Links
                .Where(l => l.ShortLink == shortLink)
                .ProjectTo<LinkDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task IncrementUsageCount(string shortLink)
        {
            var link = await _context.Links.FirstOrDefaultAsync(l => l.ShortLink == shortLink);
            link.UsageCount++;
            await _context.SaveChangesAsync();
        }

        public async Task DeactivateExpiredLinks()
        {
            var expiredLinks = await _context.Links.Where(link => link.ExpiryDate < DateTime.UtcNow).ToListAsync();

            foreach (var link in expiredLinks)
            {
                link.Active = false;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppLink link)
        {
            _context.Entry(link).State = EntityState.Modified;
        }
    }
}