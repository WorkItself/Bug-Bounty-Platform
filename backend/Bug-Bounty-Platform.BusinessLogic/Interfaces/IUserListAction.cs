using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IUserListAction
    {
        List<object> GetAllUsersAction();
        ActionResponce DeleteUserAction(int userId);
        ActionResponce UpdateUserAction(int userId, UserUpdateDto dto);
    }
}
