using API.DTOs;
using API.Entities;
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

        public async Task<IEnumerable<LinkDto>> GetLinksAsync()
        {
            return await _context.Links.ProjectTo<LinkDto>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<IEnumerable<LinkDto>> GetPersonalLinksAsync(string email)
        {
            return await _context.Links
                .Where(u => u.AppUser.Email == email)
                .ProjectTo<LinkDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
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