using API.DTOs;

namespace API.Interfaces
{
    public interface IStatisticsRepository
    {
        Task<StatisticsDto> GetStatistics(); 
    }
}