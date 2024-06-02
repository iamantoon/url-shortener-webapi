using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public List<AppLink> Links { get; set; } = new();        
    }
}