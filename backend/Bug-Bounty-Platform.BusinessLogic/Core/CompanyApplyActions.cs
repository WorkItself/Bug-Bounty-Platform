using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class CompanyApplyActions
    {
        protected ActionResponce ApplyExecution(CompanyApplyDto dto)
        {
            using (var db = new UserContext())
            {
                if (db.Users.Any(u => u.UserName == dto.UserName || u.Email == dto.Email))
                    return new ActionResponce { IsSuccess = false, Message = "Username or email already in use." };
            }

            using (var db = new CompanyProfileContext())
            {
                if (db.CompanyProfiles.Any(p => p.Handle == dto.Handle))
                    return new ActionResponce { IsSuccess = false, Message = "That handle is already taken." };
            }

            var user = new UserData
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Password = dto.Password,
                Role = UserRole.Company,
                IsApproved = false,
                RegisteredOn = DateTime.UtcNow
            };

            int userId;
            using (var db = new UserContext())
            {
                db.Users.Add(user);
                db.SaveChanges();
                userId = user.Id;
            }

            var profile = new CompanyProfile
            {
                UserId = userId,
                Handle = dto.Handle,
                LegalName = dto.LegalName,
                DisplayName = dto.DisplayName,
                LegalAddress = dto.LegalAddress,
                City = dto.City,
                Country = dto.Country,
                PostalCode = dto.PostalCode,
                Description = dto.Description,
                IsVerified = false,
                CreatedAt = DateTime.UtcNow
            };

            using (var db = new CompanyProfileContext())
            {
                db.CompanyProfiles.Add(profile);
                db.SaveChanges();
            }

            return new ActionResponce { IsSuccess = true, Message = "Application submitted. An admin will review your request." };
        }

        protected List<object> GetPendingExecution()
        {
            List<UserData> pendingUsers;
            using (var db = new UserContext())
            {
                pendingUsers = db.Users
                    .Where(u => u.Role == UserRole.Company && !u.IsApproved)
                    .ToList();
            }

            if (pendingUsers.Count == 0) return new List<object>();

            var userIds = pendingUsers.Select(u => u.Id).ToList();
            List<CompanyProfile> profiles;
            using (var db = new CompanyProfileContext())
            {
                profiles = db.CompanyProfiles.Where(p => userIds.Contains(p.UserId)).ToList();
            }

            return pendingUsers.Select(u =>
            {
                var profile = profiles.FirstOrDefault(p => p.UserId == u.Id);
                return (object)new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.RegisteredOn,
                    Handle = profile?.Handle ?? "",
                    LegalName = profile?.LegalName ?? "",
                    LegalAddress = profile?.LegalAddress ?? "",
                    City = profile?.City ?? "",
                    Country = profile?.Country ?? ""
                };
            }).ToList();
        }

        protected ActionResponce DenyExecution(int userId)
        {
            using (var profileDb = new CompanyProfileContext())
            {
                var profile = profileDb.CompanyProfiles.FirstOrDefault(p => p.UserId == userId);
                if (profile != null) { profileDb.CompanyProfiles.Remove(profile); profileDb.SaveChanges(); }
            }

            using (var userDb = new UserContext())
            {
                var user = userDb.Users.FirstOrDefault(u => u.Id == userId && u.Role == UserRole.Company);
                if (user == null)
                    return new ActionResponce { IsSuccess = false, Message = "Company account not found." };
                userDb.Users.Remove(user);
                userDb.SaveChanges();
            }

            return new ActionResponce { IsSuccess = true, Message = "Company application denied and removed." };
        }

        protected ActionResponce ApproveExecution(int userId)
        {
            using (var userDb = new UserContext())
            {
                var user = userDb.Users.FirstOrDefault(u => u.Id == userId && u.Role == UserRole.Company);
                if (user == null)
                    return new ActionResponce { IsSuccess = false, Message = "Company account not found." };

                user.IsApproved = true;
                userDb.SaveChanges();
            }

            using (var profileDb = new CompanyProfileContext())
            {
                var profile = profileDb.CompanyProfiles.FirstOrDefault(p => p.UserId == userId);
                if (profile != null)
                {
                    profile.IsVerified = true;
                    profile.VerifiedAt = DateTime.UtcNow;
                    profileDb.SaveChanges();
                }
            }

            return new ActionResponce { IsSuccess = true, Message = "Company approved." };
        }
    }
}
