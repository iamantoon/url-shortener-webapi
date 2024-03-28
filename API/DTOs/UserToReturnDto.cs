namespace API.DTOs
{
    public class UserToReturnDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public List<LinkDto> Links { get; set; }
    }
}