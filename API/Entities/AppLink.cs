namespace API.Entities
{
    public class AppLink
    {
        public int Id { get; set; }
        public string ShortLink { get; set; }
        public string Link { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime ExpiryDate { get; set; }
        public bool Active { get; set; }
        public int UsageCount { get; set; }

        public int UserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}