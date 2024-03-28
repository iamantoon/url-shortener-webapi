namespace API.DTOs
{
    public class LinkDto
    {
        public int Id { get; set; }
        public string ShortLink { get; set; }
        public string Link { get; set; }
        public DateTime Created { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool Active { get; set; }
        public int UsageCount { get; set; }
    }
}