namespace API.Extensions
{
    public class LinkParams
    {
        private const int MaxPageSize = 20;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public int MaxExpiryDate { get; set; } = 8640;
        public string OrderBy { get; set; } = "newest";
        public bool All { get; set; } = false;
    }
}