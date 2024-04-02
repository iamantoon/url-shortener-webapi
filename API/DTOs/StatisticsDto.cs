namespace API.DTOs
{
    public class StatisticsDto
    {
        public int AllLinksCount { get; set; }
        public int ActiveLinksCount { get; set; }
        public int ExpiredLinksCount { get; set; }
        public int LinksExpiringInAHourCount { get; set; }
        public int LinksExpiringInA24HoursCount { get; set; } 
        public int LinksExpiringInAWeekCount { get; set; } 
        public int LinksExpiringInAMonthCount { get; set; }
        public int LinksExpiringInThreeMonthCount { get; set; }
        public int LinksExpiringInSixMonthCount { get; set; }
    }
}