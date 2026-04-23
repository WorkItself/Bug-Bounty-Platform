using AutoMapper;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // BugReport
            CreateMap<BugReportData, BugReportDto>();
            CreateMap<BugReportDto, BugReportData>()
                .ForMember(dest => dest.SubmittedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt,   opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted,   opt => opt.Ignore());

            // BountyProgram
            CreateMap<BountyProgramData, BountyProgramDto>();
            CreateMap<BountyProgramDto, BountyProgramData>()
                .ForMember(dest => dest.CreatedAt,  opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt,  opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted,  opt => opt.Ignore());

            // User registration: DTO → Entity (Role and RegisteredOn set manually after mapping)
            CreateMap<UserRegisterDto, UserData>()
                .ForMember(dest => dest.Id,           opt => opt.Ignore())
                .ForMember(dest => dest.Role,         opt => opt.Ignore())
                .ForMember(dest => dest.RegisteredOn, opt => opt.Ignore());
        }
    }
}
