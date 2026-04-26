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

        internal bool UserLoginDataValidationExecution(UserLoginDto udata)
        {
            using var db = new UserContext();
            return db.Users.Any(x =>
                (x.UserName == udata.Credential || x.Email == udata.Credential) &&
                x.Password == udata.Password);
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

            var role = uReg.Role?.Trim().ToLower() switch
            {
                "company" => UserRole.Company,
                _ => UserRole.User
            };

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
