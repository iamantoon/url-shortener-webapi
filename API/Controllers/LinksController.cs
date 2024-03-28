using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LinksController : BaseApiController
    {   
        private readonly ILinkRepository _linkRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;
        public LinksController(ILinkRepository linkRepository, IUserRepository userRepository, IConfiguration config)
        {
            _linkRepository = linkRepository;
            _userRepository = userRepository;
            _config = config;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LinkDto>>> GetLinksAsync()
        {
            return Ok(await _linkRepository.GetLinksAsync());
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<LinkDto>>> GetPersonalLinksAsync()
        {
            var currentUserEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserEmail == null)
            {
                return BadRequest("Unable to retrieve current user.");
            }

            var links = await _linkRepository.GetPersonalLinksAsync(currentUserEmail);

            return Ok(links);
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<LinkDto>> CreateLink(CreateLinkDto createLinkDto)
        {
            var currentUserEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
            if (currentUserEmail == null)
            {
                return BadRequest("Unable to retrieve current user");
            }

            var currentUser = await _userRepository.GetUserByEmailAsync(currentUserEmail);

            string shortCode = GenerateShortCode(createLinkDto.Link);
            var shortLink = "http://localhost:5000/api/links/s/" + shortCode;

            var link = new AppLink
            {
                ShortLink = shortLink,
                Link = createLinkDto.Link,
                ExpiryDate = Convert.ToDateTime(DateTime.Now.AddHours(createLinkDto.HowManyHoursAccessible)),
                UserId = currentUser.Id,
                AppUser = currentUser,
                Active = true,
                UsageCount = 0
            };

            await _linkRepository.CreateLink(link);

            return new LinkDto
            {
                Id = link.Id,
                ShortLink = link.ShortLink,
                Link = link.Link,
                Created = link.Created,
                ExpiryDate = DateTime.Now.AddHours(createLinkDto.HowManyHoursAccessible),
                Active = true,
                UsageCount = link.UsageCount
            };
        }

        [HttpGet]
        [Route("s/{shortCode}")]
        public async Task<ActionResult> RedirectUrl(string shortCode)
        {
            string shortLink = "http://localhost:5000/api/links/s/" + shortCode;

            var url = await _linkRepository.GetLinkByShortCodeAsync(shortLink);
            
            if (url == null || !url.Active) return NotFound("This link does not exist or it has expired");

            await _linkRepository.IncrementUsageCount(shortLink);

            return Redirect(url.Link);
        }

        private string GenerateShortCode(string longUrl)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(longUrl));
                string base64Hash = Convert.ToBase64String(hashBytes);

                base64Hash = base64Hash.Replace('+', '-').Replace('/', '_');

                string alphanumericShortCode = new string(base64Hash.Where(char.IsLetterOrDigit).ToArray());

                return alphanumericShortCode.Substring(0, Math.Min(alphanumericShortCode.Length, 6));
            }
        }
    }
}