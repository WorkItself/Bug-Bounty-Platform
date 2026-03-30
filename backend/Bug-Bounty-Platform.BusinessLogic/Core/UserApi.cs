using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Entities.User;
using System.Reflection.Metadata.Ecma335;
using Bug_Bounty_Platform.Domain.Entities;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class UserApi
    {
        public ActionResponse UserLogin(ULoginData data)
        {
            // TODO: Implement login logic
            return new ActionResponse { Status = true };
        }
    }
}
