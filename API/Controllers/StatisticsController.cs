using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StatisticsController : BaseApiController
    {
        private readonly IStatisticsRepository _statisticsRepository;
        public StatisticsController(IStatisticsRepository statisticsRepository)
        {
            _statisticsRepository = statisticsRepository;
        }
            
        [HttpGet]
        public async Task<ActionResult<StatisticsDto>> GetStatistics()
        {
            var statistics = await _statisticsRepository.GetStatistics();
            return Ok(statistics);
        }
    }
}