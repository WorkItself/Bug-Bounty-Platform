using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class UserListExecution : UserActions, IUserListAction
    {
        public UserListExecution(IConfiguration configuration) : base(configuration) { }

        public List<object> GetAllUsersAction() => GetAllUsersExecution();
        public ActionResponce DeleteUserAction(int userId) => DeleteUserExecution(userId);
        public ActionResponce UpdateUserAction(int userId, UserUpdateDto dto) => UpdateUserExecution(userId, dto);
    }
}
