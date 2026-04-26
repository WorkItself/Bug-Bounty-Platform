using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class UserAuthAction : UserActions, IUserLoginAction
    {
        public UserAuthAction(IConfiguration configuration) : base(configuration) { }

        public object? UserLoginDataValidation(UserLoginDto udata)
        {
            if (IsAdminLogin(udata))
                return AdminTokenGeneration();

            var status = UserLoginDataValidationExecution(udata);
            return status switch
            {
                "OK" => UserTokenGeneration(udata),
                "PENDING_APPROVAL" => "PENDING_APPROVAL",
                _ => null
            };
        }
    }
}
