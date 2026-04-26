using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IUserProfileAction
    {
        UserProfileDto? GetMyProfile(int userId);
        (ActionResponce response, string? token) UpdateMyProfile(int userId, UserUpdateDto dto);
    }
}
