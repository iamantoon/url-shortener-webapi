using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required] [EmailAddress] public string Email { get; set; }
        [StringLength(32, MinimumLength = 4)] [Required] public string Password { get; set; } 
    }
}