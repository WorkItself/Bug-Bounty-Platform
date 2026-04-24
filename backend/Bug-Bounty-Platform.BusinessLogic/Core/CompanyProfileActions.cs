using AutoMapper;
using Bug_Bounty_Platform.BusinessLogic.Mappings;
using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class CompanyProfileActions
    {
        private readonly IMapper _mapper = MapperConfig.Mapper;

        protected CompanyProfileDto? GetProfileExecution(int userId)
        {
            using var db = new CompanyProfileContext();
            var profile = db.CompanyProfiles.FirstOrDefault(x => x.UserId == userId);
            return profile == null ? null : _mapper.Map<CompanyProfileDto>(profile);
        }

        protected ActionResponce CreateProfileExecution(CompanyProfileDto dto)
        {
            using var db = new CompanyProfileContext();

            if (db.CompanyProfiles.Any(x => x.UserId == dto.UserId))
                return new ActionResponce { IsSuccess = false, Message = "Profile already exists." };

            var profile = _mapper.Map<CompanyProfile>(dto);
            profile.IsVerified = false;
            profile.CreatedAt = DateTime.UtcNow;

            db.CompanyProfiles.Add(profile);
            db.SaveChanges();

            return new ActionResponce { IsSuccess = true, Message = "Company profile created." };
        }

        protected ActionResponce UpdateProfileExecution(CompanyProfileDto dto)
        {
            using var db = new CompanyProfileContext();
            var profile = db.CompanyProfiles.FirstOrDefault(x => x.UserId == dto.UserId);

            if (profile == null)
                return new ActionResponce { IsSuccess = false, Message = "Profile not found." };

            profile.LegalName = dto.LegalName;
            profile.DisplayName = dto.DisplayName;
            profile.LegalAddress = dto.LegalAddress;
            profile.City = dto.City;
            profile.Country = dto.Country;
            profile.PostalCode = dto.PostalCode;
            profile.TaxId = dto.TaxId;
            profile.Website = dto.Website;
            profile.Description = dto.Description;

            db.SaveChanges();

            return new ActionResponce { IsSuccess = true, Message = "Company profile updated." };
        }

        protected ActionResponce VerifyCompanyExecution(int userId)
        {
            using var db = new CompanyProfileContext();
            var profile = db.CompanyProfiles.FirstOrDefault(x => x.UserId == userId);

            if (profile == null)
                return new ActionResponce { IsSuccess = false, Message = "Profile not found." };

            profile.IsVerified = true;
            profile.VerifiedAt = DateTime.UtcNow;
            db.SaveChanges();

            return new ActionResponce { IsSuccess = true, Message = "Company verified." };
        }

        protected bool IsVerifiedExecution(int userId)
        {
            using var db = new CompanyProfileContext();
            return db.CompanyProfiles.Any(x => x.UserId == userId && x.IsVerified);
        }
    }
}
