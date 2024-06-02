using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Net.Http.Headers;
using System.Text.Json;


namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public AccountController(ITokenService tokenService, UserManager<AppUser> userManager, IMapper mapper, IConfiguration configuration)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Email)) return BadRequest("Email is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            user.Email = registerDto.Email;
            user.UserName = registerDto.Email;

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")] 
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(user => user.Email == loginDto.Email);

            if (user == null) return Unauthorized("Invalid email");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid password");

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("signin-google")]
        public async Task<ActionResult<UserDto>> ExternalLogin(ExternalLoginDto externalLogin)
        {
            var payload = await ValidateGoogleToken(externalLogin.Token);
            if (payload == null)
                return BadRequest("Invalid External Authentication");

            var info = new UserLoginInfo(externalLogin.Provider, payload.Subject, externalLogin.Provider);
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = new AppUser
                {
                    Email = payload.Email,
                    UserName = payload.Email
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                    return BadRequest("External Authentication error");

                await _userManager.AddLoginAsync(user, info);
            }

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleToken(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _configuration["Authentication:Google:ClientId"] }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return payload;
            }
            catch
            {
                return null;
            }
        }

        [HttpGet("signin-github")]
        public async Task<IActionResult> GitHubCallback(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest("Code must be supplied");
            }

            var httpClient = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("client_id", "Ov23limjOqHasbcXYUtR"),
                new KeyValuePair<string, string>("client_secret", "70734faea1a20a8a1895d4a84efb582cf2813a4c"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", "http://localhost:5000/api/account/signin-github")
            });

            var response = await httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Error exchanging code for access token");
            }

            var payload = JsonSerializer.Deserialize<Dictionary<string, string>>(await response.Content.ReadAsStringAsync());
            var accessToken = payload.GetValueOrDefault("access_token");
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token was not returned");
            }

            var redirectUrl = $"http://localhost:4200/auth-callback?token={accessToken}";
            return Redirect(redirectUrl);
        }

        [HttpPost("verify-github-token")]
        public async Task<ActionResult<UserDto>> VerifyGitHubToken([FromBody] ExternalLoginDto externalLoginDto)
        {
            if (externalLoginDto.Provider != "GitHub")
            {
                return BadRequest("Unsupported provider");
            }

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("link-shortener");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", externalLoginDto.Token);

            var response = await httpClient.GetAsync("https://api.github.com/user");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return Unauthorized("Invalid GitHub token");
            }

            var userInfo = JsonSerializer.Deserialize<GitHubUserInfo>(await response.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            string email = userInfo.Email;

            if (string.IsNullOrEmpty(email))
            {
                var emailResponse = await httpClient.GetAsync("https://api.github.com/user/emails");
                if (!emailResponse.IsSuccessStatusCode)
                {
                    var emailError = await emailResponse.Content.ReadAsStringAsync();
                    return Unauthorized("Could not retrieve GitHub email");
                }

                var emails = JsonSerializer.Deserialize<List<GitHubEmail>>(await emailResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
                var primaryEmail = emails?.FirstOrDefault(e => e.Primary && e.Verified)?.Email;

                if (string.IsNullOrEmpty(primaryEmail))
                {
                    return Unauthorized("No primary verified email associated with GitHub account");
                }

                email = primaryEmail;
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new AppUser
                {
                    Email = email,
                    UserName = email
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
            }

        return new UserDto
        {
            Email = user.Email,
            Token = _tokenService.CreateToken(user)
        };
}


        private async Task<bool> UserExists(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }
    }

    public class GitHubUserInfo
    {
        public string Login { get; set; }
        public string Email { get; set; }
    }

    public class ExternalLoginDto
    {
        public string Provider { get; set; }
        public string Token { get; set; }
    }

    public class GitHubEmail
    {
        public string Email { get; set; }
        public bool Primary { get; set; }
        public bool Verified { get; set; }
    }
}