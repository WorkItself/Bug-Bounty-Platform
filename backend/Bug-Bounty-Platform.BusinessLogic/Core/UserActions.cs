using AutoMapper;
using Bug_Bounty_Platform.BusinessLogic.Mappings;
using Bug_Bounty_Platform.BusinessLogic.Structure;
using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class UserActions
    {
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper = MapperConfig.Mapper;

        public UserActions(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<object> GetAllUsersExecution()
        {
            using var db = new UserContext();
            return db.Users.Select(u => (object)new
            {
                u.Id,
                u.UserName,
                u.Email,
                Role = u.Role.ToString(),
                u.RegisteredOn
            }).ToList();
        }

        internal bool IsAdminLogin(UserLoginDto udata)
        {
            var adminUser = _configuration["Admin:UserName"];
            var adminPass = _configuration["Admin:Password"];
            return udata.Credential == adminUser && udata.Password == adminPass;
        }

        internal string AdminTokenGeneration()
        {
            var adminUser = _configuration["Admin:UserName"]!;
            var adminData = new UserData
            {
                Id = 0,
                UserName = adminUser,
                Email = string.Empty,
                Password = string.Empty,
                Role = UserRole.Admin,
                RegisteredOn = DateTime.MinValue
            };

            return BuildToken(adminData);
        }

        internal string? UserLoginDataValidationExecution(UserLoginDto udata)
        {
            using var db = new UserContext();
            var user = db.Users.FirstOrDefault(x =>
                (x.UserName == udata.Credential || x.Email == udata.Credential) &&
                x.Password == udata.Password);

            if (user == null) return null;
            if (user.Role == UserRole.Company && !user.IsApproved)
                return "PENDING_APPROVAL";
            return "OK";
        }

        internal string UserTokenGeneration(UserLoginDto udata)
        {
            UserData user;
            using (var db = new UserContext())
            {
                user = db.Users.First(x =>
                    x.UserName == udata.Credential || x.Email == udata.Credential);
            }

            return BuildToken(user);
        }

        private string BuildToken(UserData user)
        {
            var secretKey = _configuration["Jwt:SecretKey"]!;
            var issuer = _configuration["Jwt:Issuer"]!;
            var audience = _configuration["Jwt:Audience"]!;
            var expiry = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");

            var tokenService = new TokenService(secretKey, issuer, audience, expiry);
            return tokenService.GenerateToken(user);
        }

        internal UserProfileDto? GetProfileByIdExecution(int userId)
        {
            using var db = new UserContext();
            var user = db.Users.FirstOrDefault(x => x.Id == userId);
            if (user == null) return null;
            return new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role.ToString(),
                RegisteredOn = user.RegisteredOn,
            };
        }

        internal (ActionResponce response, string? token) UpdateProfileExecution(int userId, UserUpdateDto dto)
        {
            UserData user;
            using (var db = new UserContext())
            {
                var found = db.Users.FirstOrDefault(x => x.Id == userId);
                if (found == null)
                    return (new ActionResponce { IsSuccess = false, Message = "User not found." }, null);

                if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    if (found.Password != dto.CurrentPassword)
                        return (new ActionResponce { IsSuccess = false, Message = "Current password is incorrect." }, null);
                    found.Password = dto.NewPassword;
                }

                if (!string.IsNullOrWhiteSpace(dto.UserName) && dto.UserName != found.UserName)
                {
                    var taken = db.Users.Any(x => x.UserName == dto.UserName && x.Id != userId);
                    if (taken)
                        return (new ActionResponce { IsSuccess = false, Message = "Username already taken." }, null);
                    found.UserName = dto.UserName;
                }

                if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != found.Email)
                {
                    var taken = db.Users.Any(x => x.Email == dto.Email && x.Id != userId);
                    if (taken)
                        return (new ActionResponce { IsSuccess = false, Message = "Email already in use." }, null);
                    found.Email = dto.Email;
                }

                db.SaveChanges();
                user = found;
            }

            var newToken = BuildToken(user);
            return (new ActionResponce { IsSuccess = true, Message = "Profile updated." }, newToken);
        }

        internal ActionResponce UserRegDataValidationAction(UserRegisterDto uReg)
        {
            UserData? user;
            using (var db = new UserContext())
            {
                user = db.Users.FirstOrDefault(x =>
                    x.Email == uReg.Email || x.UserName == uReg.UserName);
            }

            if (user != null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Email or Username already exists."
                };
            }

            // Companies must apply via /api/company/apply — normal registration always creates User role
            var role = UserRole.User;

            user = _mapper.Map<UserData>(uReg);
            user.Role = role;
            user.RegisteredOn = DateTime.UtcNow;

            using (var db = new UserContext())
            {
                db.Users.Add(user);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "User registration successful."
            };
        }
    }
}
