using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class UserListExecution : UserActions, IUserListAction
    {
        public UserListExecution(IConfiguration configuration) : base(configuration) { }

        public List<object> GetAllUsersAction() => GetAllUsersExecution();
    }
}
