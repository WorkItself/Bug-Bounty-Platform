using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.BusinessLogic.Structure;

namespace Bug_Bounty_Platform.BusinessLogic
{
    public class BusinessLogic
    {
        public BusinessLogic() { }

        public IUserLoginAction UserLoginAction()
        {
            return new UserAuthAction();
        }

        public IUserRegAction UserRegAction()
        {
            return new UserRegActionExecution();
        }

        public IBountyProgramAction BountyProgramAction()
        {
            return new BountyProgramExecution();
        }

        public IBugReportAction BugReportAction()
        {
            return new BugReportExecution();
        }
    }
}
