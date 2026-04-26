using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class UserProfileExecution : UserActions, IUserProfileAction
    {
        public UserProfileExecution(IConfiguration configuration) : base(configuration) { }

        public UserProfileDto? GetMyProfile(int userId) => GetProfileByIdExecution(userId);

        public (ActionResponce response, string? token) UpdateMyProfile(int userId, UserUpdateDto dto)
            => UpdateProfileExecution(userId, dto);
    }
}
