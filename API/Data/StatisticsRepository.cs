using API.DTOs;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly DataContext _context;
        public StatisticsRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<StatisticsDto> GetStatistics()
        {

        var now = DateTime.Now;

        var links = await _context.Links
            .Select(link => new
            {
                link.ExpiryDate,
                IsExpired = link.ExpiryDate < now
            })
            .ToListAsync();

            var allLinksCount = links.Count;
            var activeLinksCount = links.Count(link => !link.IsExpired);
            var expiredLinksCount = links.Count(link => link.IsExpired);
            var linksExpiringInAHourCount = links.Count(link => link.ExpiryDate <= now.AddHours(1) && link.ExpiryDate > now);
            var linksExpiringInA24HourCount = links.Count(link => link.ExpiryDate <= now.AddHours(24) && link.ExpiryDate > now);
            var linksExpiringInAWeekCount = links.Count(link => link.ExpiryDate <= now.AddHours(168) && link.ExpiryDate > now);
            var linksExpiringInAMonthCount = links.Count(link => link.ExpiryDate <= now.AddHours(720) && link.ExpiryDate > now);
            var linksExpiringInThreeMonthCount = links.Count(link => link.ExpiryDate <= now.AddHours(2160) && link.ExpiryDate > now);
            var linksExpiringInSixMonthCount = links.Count(link => link.ExpiryDate <= now.AddHours(4320) && link.ExpiryDate > now);

            return new StatisticsDto
            {
                AllLinksCount = allLinksCount,
                ActiveLinksCount = activeLinksCount,
                ExpiredLinksCount = expiredLinksCount,
                LinksExpiringInAHourCount = linksExpiringInAHourCount,
                LinksExpiringInA24HoursCount = linksExpiringInA24HourCount,
                LinksExpiringInAWeekCount = linksExpiringInAWeekCount,
                LinksExpiringInAMonthCount = linksExpiringInAMonthCount,
                LinksExpiringInThreeMonthCount = linksExpiringInThreeMonthCount,
                LinksExpiringInSixMonthCount = linksExpiringInSixMonthCount
            };
        }
    }
}