using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppLink, LinkDto>();
            CreateMap<AppUser, UserToReturnDto>();
            CreateMap<RegisterDto, AppUser>();
        }
    }
}